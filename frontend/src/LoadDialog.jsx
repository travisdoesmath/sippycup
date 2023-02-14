import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export function LoadDialog(props) {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (projectName) => {
        props.onSubmit(projectName)
        .then(() => { setOpen(false) })
        
    }

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>{props.label}</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Load Project</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter project name to load
                    </DialogContentText>
                    <TextField
                        autoFocus
                        id="projectName"
                        label="Project Name"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Load</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}