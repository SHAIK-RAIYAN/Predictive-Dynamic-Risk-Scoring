import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  Close,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import apiService from '../../services/apiService';

const EntityManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [addEntityDialogOpen, setAddEntityDialogOpen] = useState(false);
  const [newEntity, setNewEntity] = useState({
    name: '',
    type: 'User',
    department: '',
    email: '',
    ipAddress: '',
  });

  const { data: entities, isLoading, error } = useQuery(
    'entities',
    () => apiService.getAllEntities(),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  const getRiskColor = (score) => {
    if (score >= 40) return '#f44336';
    if (score >= 25) return '#ff9800';
    return '#4caf50';
  };

  const getRiskStatus = (score) => {
    if (score >= 40) return 'High';
    if (score >= 25) return 'Medium';
    return 'Low';
  };

  const handleView = async (entity) => {
    try {
      const assessment = await apiService.assessEntityRisk(entity.name);
      setSelectedEntity({ ...entity, assessment });
      setDetailsDialogOpen(true);
    } catch (error) {
      toast.error('Failed to load entity details');
    }
  };

  const handleMenuOpen = (event, entity) => {
    setAnchorEl(event.currentTarget);
    setSelectedEntity(entity);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEntity(null);
  };

  const handleBulkAction = (action) => {
    if (selectedRows.length === 0) {
      toast.error('Please select entities first');
      return;
    }
    toast.success(`${action} action performed on ${selectedRows.length} entities`);
    setSelectedRows([]);
  };

  const handleAddEntity = async () => {
    try {
      if (!newEntity.name.trim()) {
        toast.error('Please enter entity name');
        return;
      }

      // Generate a unique ID for the entity
      const entityId = newEntity.name.toLowerCase().replace(/\s+/g, '-');
      
      const entityData = {
        id: entityId,
        name: newEntity.name,
        type: newEntity.type,
        department: newEntity.department,
        email: newEntity.email,
        ipAddress: newEntity.ipAddress,
        riskScore: Math.floor(Math.random() * 30) + 10, // Random risk score between 10-40
        status: 'Active',
        lastActivity: 'Just now',
      };

      // Add to Firebase database
      await apiService.addEntity(entityData);
      
      toast.success('Entity added successfully!');
      setAddEntityDialogOpen(false);
      setNewEntity({
        name: '',
        type: 'User',
        department: '',
        email: '',
        ipAddress: '',
      });
    } catch (error) {
      toast.error('Failed to add entity');
    }
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Entity Name', 
      width: 200, 
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">{params.value}</Typography>
          <Typography variant="caption" color="textSecondary">{params.row.ipAddress}</Typography>
        </Box>
      )
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 120, 
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" />
      )
    },
    { field: 'department', headerName: 'Department', width: 150 },
    { 
      field: 'riskScore', 
      headerName: 'Risk Score', 
      width: 130, 
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: getRiskColor(params.value), mr: 1 }}>
            {params.value}
          </Typography>
          <Chip
            label={getRiskStatus(params.value)}
            size="small"
            sx={{
              backgroundColor: getRiskColor(params.value),
              color: 'white',
            }}
          />
        </Box>
      )
    },
    { field: 'lastActivity', headerName: 'Last Activity', width: 150 },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 120, 
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => handleView(params.row)}>
            <Visibility />
          </IconButton>
          <IconButton size="small" onClick={(e) => handleMenuOpen(e, params.row)}>
            <MoreVert />
          </IconButton>
        </Box>
      )
    },
  ];

  const filteredEntities = entities?.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || entity.department === departmentFilter;
    const matchesStatus = !statusFilter || getRiskStatus(entity.riskScore) === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  }) || [];

  const departments = [...new Set(entities?.map(entity => entity.department) || [])];
  const statuses = ['High', 'Medium', 'Low'];

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center h-64">
        <CircularProgress size={60} />
        <Typography variant="h6" className="ml-4 text-gray-600 dark:text-gray-400">
          Loading entities...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="mt-4">
        Failed to load entities. Please try again.
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Typography 
          variant="h4" 
          component="h1"
          className="font-bold text-black dark:text-white mb-2 tracking-tight"
        >
          Entity Management
        </Typography>
        <Typography 
          variant="body1" 
          className="text-gray-600 dark:text-gray-400"
        >
          Monitor and manage all entities in your security environment
        </Typography>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="mb-6">
          <CardContent>
            <Box className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <TextField
                label="Search Entities"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
                size="small"
              />
              <FormControl size="small" className="min-w-[150px]">
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" className="min-w-[120px]">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  {statuses.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddEntityDialogOpen(true)}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Add Entity
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Alert severity="info">
            <Box className="flex items-center justify-between">
              <Typography variant="body2">
                {selectedRows.length} entity(ies) selected
              </Typography>
              <Box className="flex gap-2">
                <Button size="small" onClick={() => handleBulkAction('Export')}>
                  Export
                </Button>
                <Button size="small" onClick={() => handleBulkAction('Assess')}>
                  Bulk Assess
                </Button>
                <Button size="small" color="error" onClick={() => handleBulkAction('Delete')}>
                  Delete
                </Button>
              </Box>
            </Box>
          </Alert>
        </motion.div>
      )}

      {/* Data Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            <DataGrid
              rows={filteredEntities}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
              className="border-0"
              sx={{
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #e0e0e0',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  borderBottom: '2px solid #e0e0e0',
                },
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Entity Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6" className="font-semibold">
            Entity Details: {selectedEntity?.name}
          </Typography>
          <IconButton onClick={() => setDetailsDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedEntity?.assessment && (
            <Box className="space-y-4">
              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography variant="subtitle1" className="font-semibold mb-2">
                    Entity Information
                  </Typography>
                  <Typography variant="body2" className="mb-1">
                    <strong>Name:</strong> {selectedEntity.name}
                  </Typography>
                  <Typography variant="body2" className="mb-1">
                    <strong>Type:</strong> {selectedEntity.type}
                  </Typography>
                  <Typography variant="body2" className="mb-1">
                    <strong>Department:</strong> {selectedEntity.department}
                  </Typography>
                  <Typography variant="body2" className="mb-1">
                    <strong>IP Address:</strong> {selectedEntity.ipAddress}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" className="font-semibold mb-2">
                    Risk Assessment
                  </Typography>
                  <Typography variant="body2" className="mb-1">
                    <strong>Risk Score:</strong> {selectedEntity.assessment.overallScore}
                  </Typography>
                  <Typography variant="body2" className="mb-1">
                    <strong>Risk Level:</strong> {selectedEntity.assessment.riskLevel}
                  </Typography>
                  <Typography variant="body2" className="mb-1">
                    <strong>Last Activity:</strong> {selectedEntity.lastActivity}
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Risk Factors
                </Typography>
                {selectedEntity.assessment.factors?.map((factor, index) => (
                  <Box key={index} className="mb-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <Typography variant="body2" className="font-medium">
                      {factor.name}
                    </Typography>
                    <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                      {factor.description}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box>
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Recommendations
                </Typography>
                {selectedEntity.assessment.recommendations?.map((rec, index) => (
                  <Typography key={index} variant="body2" className="mb-1">
                    • {rec}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Entity Dialog */}
      <Dialog 
        open={addEntityDialogOpen} 
        onClose={() => setAddEntityDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6" className="font-semibold">
            Add New Entity
          </Typography>
          <IconButton onClick={() => setAddEntityDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              fullWidth
              label="Entity Name"
              variant="outlined"
              value={newEntity.name}
              onChange={(e) => setNewEntity({...newEntity, name: e.target.value})}
              placeholder="Enter entity name"
            />
            <FormControl fullWidth>
              <InputLabel>Entity Type</InputLabel>
              <Select
                value={newEntity.type}
                onChange={(e) => setNewEntity({...newEntity, type: e.target.value})}
                label="Entity Type"
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Server">Server</MenuItem>
                <MenuItem value="Database">Database</MenuItem>
                <MenuItem value="Application">Application</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Department"
              variant="outlined"
              value={newEntity.department}
              onChange={(e) => setNewEntity({...newEntity, department: e.target.value})}
              placeholder="Enter department"
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={newEntity.email}
              onChange={(e) => setNewEntity({...newEntity, email: e.target.value})}
              placeholder="Enter email address"
            />
            <TextField
              fullWidth
              label="IP Address"
              variant="outlined"
              value={newEntity.ipAddress}
              onChange={(e) => setNewEntity({...newEntity, ipAddress: e.target.value})}
              placeholder="Enter IP address"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddEntityDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleAddEntity}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Add Entity
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleView(selectedEntity);
          handleMenuClose();
        }}>
          <Visibility className="mr-2" /> View Details
        </MenuItem>
        <MenuItem onClick={() => {
          toast.success('Edit functionality coming soon');
          handleMenuClose();
        }}>
          <Edit className="mr-2" /> Edit
        </MenuItem>
        <MenuItem onClick={() => {
          toast.success('Delete functionality coming soon');
          handleMenuClose();
        }}>
          <Delete className="mr-2" /> Delete
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default EntityManagement; 