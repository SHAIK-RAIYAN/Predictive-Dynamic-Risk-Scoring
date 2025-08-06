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
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Visibility,
  MoreVert,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';

// Mock data
const mockEntities = [
  { id: 1, name: 'user-john.doe', type: 'User', department: 'Engineering', riskScore: 45, status: 'High', lastActivity: '2 min ago', ipAddress: '192.168.1.100' },
  { id: 2, name: 'server-prod-01', type: 'Server', department: 'Infrastructure', riskScore: 38, status: 'Medium', lastActivity: '5 min ago', ipAddress: '10.0.0.50' },
  { id: 3, name: 'user-sarah.smith', type: 'User', department: 'Finance', riskScore: 42, status: 'High', lastActivity: '8 min ago', ipAddress: '192.168.1.101' },
  { id: 4, name: 'database-main', type: 'Database', department: 'IT', riskScore: 35, status: 'Medium', lastActivity: '12 min ago', ipAddress: '10.0.0.100' },
  { id: 5, name: 'user-mike.wilson', type: 'User', department: 'HR', riskScore: 31, status: 'Medium', lastActivity: '15 min ago', ipAddress: '192.168.1.102' },
  { id: 6, name: 'web-server-01', type: 'Server', department: 'Infrastructure', riskScore: 22, status: 'Low', lastActivity: '20 min ago', ipAddress: '10.0.0.51' },
  { id: 7, name: 'user-lisa.jones', type: 'User', department: 'Marketing', riskScore: 18, status: 'Low', lastActivity: '25 min ago', ipAddress: '192.168.1.103' },
  { id: 8, name: 'backup-server', type: 'Server', department: 'IT', riskScore: 28, status: 'Medium', lastActivity: '30 min ago', ipAddress: '10.0.0.200' },
];

const EntityManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const { data: entities, isLoading } = useQuery(
    'entities',
    () => new Promise((resolve) => setTimeout(() => resolve(mockEntities), 1000))
  );

  const getRiskColor = (score) => {
    if (score >= 40) return '#f44336';
    if (score >= 25) return '#ff9800';
    return '#4caf50';
  };

  const columns = [
    { field: 'name', headerName: 'Entity Name', width: 200, renderCell: (params) => (
      <Box>
        <Typography variant="body2" fontWeight="medium">{params.value}</Typography>
        <Typography variant="caption" color="textSecondary">{params.row.ipAddress}</Typography>
      </Box>
    )},
    { field: 'type', headerName: 'Type', width: 120, renderCell: (params) => (
      <Chip label={params.value} size="small" variant="outlined" />
    )},
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'riskScore', headerName: 'Risk Score', width: 130, renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: getRiskColor(params.value), mr: 1 }}>
          {params.value}
        </Typography>
        <Chip
          label={params.row.status}
          size="small"
          sx={{
            backgroundColor: getRiskColor(params.value),
            color: 'white',
          }}
        />
      </Box>
    )},
    { field: 'lastActivity', headerName: 'Last Activity', width: 150 },
    { field: 'actions', headerName: 'Actions', width: 120, renderCell: (params) => (
      <Box>
        <IconButton size="small" onClick={() => handleView(params.row)}>
          <Visibility />
        </IconButton>
        <IconButton size="small" onClick={(e) => handleMenuOpen(e, params.row)}>
          <MoreVert />
        </IconButton>
      </Box>
    )},
  ];

  const handleView = (entity) => {
    toast.success(`Viewing ${entity.name}`);
  };

  const handleMenuOpen = (event, entity) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBulkAction = (action) => {
    if (selectedRows.length === 0) {
      toast.error('Please select entities first');
      return;
    }
    toast.success(`${action} action performed on ${selectedRows.length} entities`);
    setSelectedRows([]);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Entity Management
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              placeholder="Search entities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <Search /> }}
              sx={{ flexGrow: 1 }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                label="Department"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Infrastructure">Infrastructure</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="High">High Risk</MenuItem>
                <MenuItem value="Medium">Medium Risk</MenuItem>
                <MenuItem value="Low">Low Risk</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" startIcon={<Add />}>
              Add Entity
            </Button>
          </Box>

          {selectedRows.length > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {selectedRows.length} entities selected
              <Button size="small" sx={{ ml: 2 }} onClick={() => handleBulkAction('Export')}>
                Export
              </Button>
              <Button size="small" sx={{ ml: 1 }} onClick={() => handleBulkAction('Assess')}>
                Bulk Assess
              </Button>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DataGrid
            rows={entities || []}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
            loading={isLoading}
            sx={{
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #173a5e',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderBottom: '2px solid #173a5e',
              },
            }}
          />
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Visibility sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default EntityManagement; 