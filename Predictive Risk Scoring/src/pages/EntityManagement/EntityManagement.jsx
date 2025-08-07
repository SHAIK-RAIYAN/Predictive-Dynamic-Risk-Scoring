import React, { useState, useEffect } from 'react';
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
  Tooltip,
  Snackbar,
  ConfirmationDialog,
  LinearProgress,
  Grid,
  Divider,
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
  Refresh,
  Download,
  Upload,
  Security,
  Warning,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/apiService';

const EntityManagement = () => {
  const queryClient = useQueryClient();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [addEntityDialogOpen, setAddEntityDialogOpen] = useState(false);
  const [editEntityDialogOpen, setEditEntityDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form states
  const [newEntity, setNewEntity] = useState({
    name: '',
    type: 'User',
    department: '',
    email: '',
    ipAddress: '',
    location: '',
    description: '',
  });

  const [editingEntity, setEditingEntity] = useState({
    name: '',
    type: 'User',
    department: '',
    email: '',
    ipAddress: '',
    location: '',
    description: '',
  });

  // Queries and mutations
  const { 
    data: entities, 
    isLoading, 
    error, 
    refetch 
  } = useQuery(
    'entities',
    () => apiService.getAllEntities(),
    {
      refetchInterval: 30000,
      staleTime: 10000,
    }
  );

  const addEntityMutation = useMutation(
    (entityData) => apiService.addEntity(entityData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('entities');
        toast.success('Entity added successfully!');
        setAddEntityDialogOpen(false);
        resetNewEntityForm();
      },
      onError: (error) => {
        console.error('Error adding entity:', error);
        toast.error('Failed to add entity. Please try again.');
      },
    }
  );

  const updateEntityMutation = useMutation(
    ({ entityId, updateData }) => apiService.updateEntity(entityId, updateData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('entities');
        toast.success('Entity updated successfully!');
        setEditEntityDialogOpen(false);
        resetEditingEntityForm();
      },
      onError: (error) => {
        console.error('Error updating entity:', error);
        toast.error('Failed to update entity. Please try again.');
      },
    }
  );

  const deleteEntityMutation = useMutation(
    (entityId) => apiService.deleteEntity(entityId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('entities');
        toast.success('Entity deleted successfully!');
        setDeleteConfirmOpen(false);
        setSelectedEntity(null);
      },
      onError: (error) => {
        console.error('Error deleting entity:', error);
        toast.error('Failed to delete entity. Please try again.');
      },
    }
  );

  // Utility functions
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

  const getRiskIcon = (score) => {
    if (score >= 40) return <Warning />;
    if (score >= 25) return <Security />;
    return <CheckCircle />;
  };

  const resetNewEntityForm = () => {
    setNewEntity({
      name: '',
      type: 'User',
      department: '',
      email: '',
      ipAddress: '',
      location: '',
      description: '',
    });
  };

  const resetEditingEntityForm = () => {
    setEditingEntity({
      name: '',
      type: 'User',
      department: '',
      email: '',
      ipAddress: '',
      location: '',
      description: '',
    });
  };

  // Event handlers
  const handleView = async (entity) => {
    try {
      const assessment = await apiService.assessEntityRisk(entity.id);
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

  const handleAddEntity = async () => {
    if (!newEntity.name.trim()) {
      toast.error('Please enter entity name');
      return;
    }

    if (!newEntity.department.trim()) {
      toast.error('Please enter department');
      return;
    }

    setIsSubmitting(true);
    try {
      const entityId = newEntity.name.toLowerCase().replace(/\s+/g, '-');
      
      const entityData = {
        id: entityId,
        name: newEntity.name,
        type: newEntity.type,
        department: newEntity.department,
        email: newEntity.email,
        ipAddress: newEntity.ipAddress,
        location: newEntity.location,
        description: newEntity.description,
        riskScore: Math.floor(Math.random() * 30) + 10,
        status: 'Active',
        lastActivity: 'Just now',
      };

      await addEntityMutation.mutateAsync(entityData);
    } catch (error) {
      console.error('Error in handleAddEntity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEntity = (entity) => {
    setEditingEntity({
      name: entity.name,
      type: entity.type,
      department: entity.department,
      email: entity.email || '',
      ipAddress: entity.ipAddress || '',
      location: entity.location || '',
      description: entity.description || '',
    });
    setEditEntityDialogOpen(true);
  };

  const handleUpdateEntity = async () => {
    if (!editingEntity.name.trim()) {
      toast.error('Please enter entity name');
      return;
    }

    if (!editingEntity.department.trim()) {
      toast.error('Please enter department');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        name: editingEntity.name,
        type: editingEntity.type,
        department: editingEntity.department,
        email: editingEntity.email,
        ipAddress: editingEntity.ipAddress,
        location: editingEntity.location,
        description: editingEntity.description,
      };

      await updateEntityMutation.mutateAsync({
        entityId: selectedEntity.id,
        updateData
      });
    } catch (error) {
      console.error('Error in handleUpdateEntity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntity = async () => {
    if (!selectedEntity) return;
    
    setIsSubmitting(true);
    try {
      await deleteEntityMutation.mutateAsync(selectedEntity.id);
    } catch (error) {
      console.error('Error in handleDeleteEntity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error('Please select entities first');
      return;
    }

    setIsSubmitting(true);
    try {
      const deletePromises = selectedRows.map(entityId => 
        apiService.deleteEntity(entityId)
      );
      await Promise.all(deletePromises);
      
      queryClient.invalidateQueries('entities');
      toast.success(`${selectedRows.length} entities deleted successfully!`);
      setSelectedRows([]);
      setBulkDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast.error('Failed to delete some entities. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedRows.length === 0) {
      toast.error('Please select entities first');
      return;
    }

    switch (action) {
      case 'export':
        // Implement export functionality
        toast.success(`Exporting ${selectedRows.length} entities...`);
        break;
      case 'assess':
        // Implement bulk assessment
        toast.success(`Assessing ${selectedRows.length} entities...`);
        break;
      case 'delete':
        setBulkDeleteConfirmOpen(true);
        break;
      default:
        toast.error('Unknown action');
    }
  };

  // Data grid columns
  const columns = [
    { 
      field: 'name', 
      headerName: 'Entity Name', 
      width: 250, 
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">{params.value}</Typography>
          <Typography variant="caption" color="textSecondary">
            {params.row.ipAddress || 'No IP'}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 120, 
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined"
          color={params.value === 'User' ? 'primary' : 'secondary'}
        />
      )
    },
    { 
      field: 'department', 
      headerName: 'Department', 
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="textSecondary">
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'riskScore', 
      headerName: 'Risk Score', 
      width: 150, 
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getRiskIcon(params.value)}
          <Typography variant="body2" sx={{ color: getRiskColor(params.value), fontWeight: 'bold' }}>
            {params.value}
          </Typography>
          <Chip
            label={getRiskStatus(params.value)}
            size="small"
            sx={{
              backgroundColor: getRiskColor(params.value),
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        </Box>
      )
    },
    { 
      field: 'lastActivity', 
      headerName: 'Last Activity', 
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="textSecondary">
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 120, 
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => handleView(params.row)}>
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Actions">
            <IconButton size="small" onClick={(e) => handleMenuOpen(e, params.row)}>
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
  ];

  // Filtered entities with improved filtering
  const filteredEntities = entities?.filter(entity => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = entity.name.toLowerCase().includes(searchLower) ||
                         entity.id.toLowerCase().includes(searchLower) ||
                         (entity.email && entity.email.toLowerCase().includes(searchLower)) ||
                         (entity.ipAddress && entity.ipAddress.toLowerCase().includes(searchLower)) ||
                         (entity.department && entity.department.toLowerCase().includes(searchLower));
    const matchesDepartment = !departmentFilter || entity.department === departmentFilter;
    const matchesStatus = !statusFilter || getRiskStatus(entity.riskScore) === statusFilter;
    const matchesType = !typeFilter || entity.type === typeFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesType;
  }) || [];

  // Unique values for filters
  const departments = [...new Set(entities?.map(entity => entity.department) || [])];
  const types = [...new Set(entities?.map(entity => entity.type) || [])];
  const statuses = ['High', 'Medium', 'Low'];

  // Loading and error states
  if (isLoading) {
    return (
      <Box className="flex flex-col items-center justify-center h-64">
        <CircularProgress size={60} />
        <Typography variant="h6" className="mt-4 text-gray-600 dark:text-gray-400">
          Loading entities...
        </Typography>
        <LinearProgress className="w-64 mt-4" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="mt-4">
        <Typography variant="body1">
          Failed to load entities. Please try again.
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => refetch()}
          className="mt-2"
        >
          Retry
        </Button>
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
        <Box className="flex justify-between items-start">
          <Box>
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
          </Box>
          <Box className="flex gap-2">
            <Tooltip title="Refresh Data">
              <IconButton onClick={() => refetch()}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardContent>
                <Typography variant="h4" className="font-bold text-blue-600 dark:text-blue-400">
                  {entities?.length || 0}
                </Typography>
                <Typography variant="body2" className="text-blue-600 dark:text-blue-400">
                  Total Entities
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-red-50 dark:bg-red-900/20">
              <CardContent>
                <Typography variant="h4" className="font-bold text-red-600 dark:text-red-400">
                  {entities?.filter(e => getRiskStatus(e.riskScore) === 'High').length || 0}
                </Typography>
                <Typography variant="body2" className="text-red-600 dark:text-red-400">
                  High Risk
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-orange-50 dark:bg-orange-900/20">
              <CardContent>
                <Typography variant="h4" className="font-bold text-orange-600 dark:text-orange-400">
                  {entities?.filter(e => getRiskStatus(e.riskScore) === 'Medium').length || 0}
                </Typography>
                <Typography variant="body2" className="text-orange-600 dark:text-orange-400">
                  Medium Risk
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardContent>
                <Typography variant="h4" className="font-bold text-green-600 dark:text-green-400">
                  {entities?.filter(e => getRiskStatus(e.riskScore) === 'Low').length || 0}
                </Typography>
                <Typography variant="body2" className="text-green-600 dark:text-green-400">
                  Low Risk
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-6">
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Search Entities"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  placeholder="Search by name, ID, or email..."
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
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
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    label="Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {types.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
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
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddEntityDialogOpen(true)}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  Add Entity
                </Button>
              </Grid>
            </Grid>
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
                <Button size="small" onClick={() => handleBulkAction('export')}>
                  <Download className="mr-1" />
                  Export
                </Button>
                <Button size="small" onClick={() => handleBulkAction('assess')}>
                  <Security className="mr-1" />
                  Bulk Assess
                </Button>
                <Button 
                  size="small" 
                  color="error" 
                  onClick={() => handleBulkAction('delete')}
                >
                  <Delete className="mr-1" />
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
        transition={{ duration: 0.5, delay: 0.3 }}
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
              loading={isLoading}
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
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f8f9fa',
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
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" className="font-semibold mb-2">
                    Entity Information
                  </Typography>
                  <Box className="space-y-2">
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedEntity.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Type:</strong> {selectedEntity.type}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Department:</strong> {selectedEntity.department}
                    </Typography>
                    <Typography variant="body2">
                      <strong>IP Address:</strong> {selectedEntity.ipAddress || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedEntity.email || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Location:</strong> {selectedEntity.location || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" className="font-semibold mb-2">
                    Risk Assessment
                  </Typography>
                  <Box className="space-y-2">
                    <Typography variant="body2">
                      <strong>Risk Score:</strong> {selectedEntity.assessment.overallScore}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Risk Level:</strong> {selectedEntity.assessment.riskLevel}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Last Activity:</strong> {selectedEntity.lastActivity}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {selectedEntity.status}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Risk Factors
                </Typography>
                <Grid container spacing={2}>
                  {selectedEntity.assessment.factors?.map((factor, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card variant="outlined" className="p-3">
                        <Box className="flex justify-between items-start mb-2">
                          <Typography variant="body2" className="font-medium">
                            {factor.name}
                          </Typography>
                          <Chip
                            label={`${factor.score} pts`}
                            size="small"
                            sx={{
                              backgroundColor: getRiskColor(factor.score),
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        </Box>
                        <Typography variant="caption" className="text-gray-600 dark:text-gray-400">
                          {factor.description}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" className="font-semibold mb-2">
                  Recommendations
                </Typography>
                {selectedEntity.assessment.recommendations?.map((rec, index) => (
                  <Typography key={index} variant="body2" className="mb-1 flex items-center">
                    <CheckCircle className="mr-2 text-green-600" fontSize="small" />
                    {rec}
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
              label="Entity Name *"
              variant="outlined"
              value={newEntity.name}
              onChange={(e) => setNewEntity({...newEntity, name: e.target.value})}
              placeholder="Enter entity name"
              required
            />
            <FormControl fullWidth>
              <InputLabel>Entity Type *</InputLabel>
              <Select
                value={newEntity.type}
                onChange={(e) => setNewEntity({...newEntity, type: e.target.value})}
                label="Entity Type *"
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Server">Server</MenuItem>
                <MenuItem value="Database">Database</MenuItem>
                <MenuItem value="Application">Application</MenuItem>
                <MenuItem value="Network Device">Network Device</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Department *"
              variant="outlined"
              value={newEntity.department}
              onChange={(e) => setNewEntity({...newEntity, department: e.target.value})}
              placeholder="Enter department"
              required
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={newEntity.email}
              onChange={(e) => setNewEntity({...newEntity, email: e.target.value})}
              placeholder="Enter email address"
              type="email"
            />
            <TextField
              fullWidth
              label="IP Address"
              variant="outlined"
              value={newEntity.ipAddress}
              onChange={(e) => setNewEntity({...newEntity, ipAddress: e.target.value})}
              placeholder="Enter IP address"
            />
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={newEntity.location}
              onChange={(e) => setNewEntity({...newEntity, location: e.target.value})}
              placeholder="Enter location"
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={newEntity.description}
              onChange={(e) => setNewEntity({...newEntity, description: e.target.value})}
              placeholder="Enter description"
              multiline
              rows={3}
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
            disabled={isSubmitting}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            {isSubmitting ? <CircularProgress size={20} /> : 'Add Entity'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Entity Dialog */}
      <Dialog 
        open={editEntityDialogOpen} 
        onClose={() => setEditEntityDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6" className="font-semibold">
            Edit Entity: {selectedEntity?.name}
          </Typography>
          <IconButton onClick={() => setEditEntityDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              fullWidth
              label="Entity Name *"
              variant="outlined"
              value={editingEntity.name}
              onChange={(e) => setEditingEntity({...editingEntity, name: e.target.value})}
              placeholder="Enter entity name"
              required
            />
            <FormControl fullWidth>
              <InputLabel>Entity Type *</InputLabel>
              <Select
                value={editingEntity.type}
                onChange={(e) => setEditingEntity({...editingEntity, type: e.target.value})}
                label="Entity Type *"
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Server">Server</MenuItem>
                <MenuItem value="Database">Database</MenuItem>
                <MenuItem value="Application">Application</MenuItem>
                <MenuItem value="Network Device">Network Device</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Department *"
              variant="outlined"
              value={editingEntity.department}
              onChange={(e) => setEditingEntity({...editingEntity, department: e.target.value})}
              placeholder="Enter department"
              required
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={editingEntity.email}
              onChange={(e) => setEditingEntity({...editingEntity, email: e.target.value})}
              placeholder="Enter email address"
              type="email"
            />
            <TextField
              fullWidth
              label="IP Address"
              variant="outlined"
              value={editingEntity.ipAddress}
              onChange={(e) => setEditingEntity({...editingEntity, ipAddress: e.target.value})}
              placeholder="Enter IP address"
            />
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={editingEntity.location}
              onChange={(e) => setEditingEntity({...editingEntity, location: e.target.value})}
              placeholder="Enter location"
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={editingEntity.description}
              onChange={(e) => setEditingEntity({...editingEntity, description: e.target.value})}
              placeholder="Enter description"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditEntityDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleUpdateEntity}
            disabled={isSubmitting}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            {isSubmitting ? <CircularProgress size={20} /> : 'Update Entity'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex items-center">
          <Error className="mr-2 text-red-600" />
          <Typography variant="h6" className="font-semibold">
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" className="mb-2">
            Are you sure you want to delete the entity "{selectedEntity?.name}"?
          </Typography>
          <Typography variant="body2" color="textSecondary">
            This action cannot be undone. All associated data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteEntity}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={bulkDeleteConfirmOpen}
        onClose={() => setBulkDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex items-center">
          <Error className="mr-2 text-red-600" />
          <Typography variant="h6" className="font-semibold">
            Confirm Bulk Delete
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" className="mb-2">
            Are you sure you want to delete {selectedRows.length} selected entities?
          </Typography>
          <Typography variant="body2" color="textSecondary">
            This action cannot be undone. All associated data will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleBulkDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={20} /> : 'Delete All'}
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
          handleEditEntity(selectedEntity);
          handleMenuClose();
        }}>
          <Edit className="mr-2" /> Edit
        </MenuItem>
        <MenuItem onClick={() => {
          setDeleteConfirmOpen(true);
          handleMenuClose();
        }}>
          <Delete className="mr-2" /> Delete
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default EntityManagement; 