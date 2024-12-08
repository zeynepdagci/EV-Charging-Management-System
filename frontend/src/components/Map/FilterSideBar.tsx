import { Drawer, Box, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from "@mui/material";
import { useState } from "react";

interface FilterSidebarProps {
    open: boolean;
    onClose: () => void;
    filters: { minPowerKw: number; distance: number; status: string };
    setFilters: React.Dispatch<React.SetStateAction<{ minPowerKw: number; distance: number; status: string }>>;
    fetchStations: () => void;
}

export default function FilterSidebar({
    open,
    onClose,
    filters,
    setFilters,
    fetchStations,
}: FilterSidebarProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string | undefined; value: unknown }>) => {
        setLocalFilters({ ...localFilters, [e.target.name!]: e.target.value });
    };

    const handleStatusChange = (e: SelectChangeEvent<string>) => {
        setLocalFilters({ ...localFilters, status: e.target.value });
    };

    const applyFilters = () => {
        setFilters(localFilters);
        fetchStations();
        onClose();
    };

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box padding={2} width="250px">
                <Typography variant="h6" color="primary">
                    Filters
                </Typography>
                <Box my={2}>
                    <TextField
                        label="Minimum Power (kW)"
                        type="number"
                        name="minPowerKw"
                        value={localFilters.minPowerKw}
                        onChange={handleFilterChange}
                        fullWidth
                    />
                </Box>
                <Box my={2}>
                    <TextField
                        label="Distance (km)"
                        type="number"
                        name="distance"
                        value={localFilters.distance}
                        onChange={handleFilterChange}
                        fullWidth
                    />
                </Box>
                <Box my={2}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={localFilters.status}
                            onChange={handleStatusChange}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Available">Available</MenuItem>
                            <MenuItem value="In Use">In Use</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Button onClick={applyFilters} color="primary" variant="contained" fullWidth>
                    Apply Filters
                </Button>
                <Button onClick={onClose} color="secondary" fullWidth>
                    Cancel
                </Button>
            </Box>
        </Drawer>
    );
}
