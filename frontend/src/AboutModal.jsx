import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';

export default function AboutModal() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        const coffeeWidgetButton = document.querySelector('#bmc-wbtn')
        coffeeWidgetButton.style.display = "flex"
        coffeeWidgetButton.style.opacity = 1
    }

    const handleClose = () => {
        setOpen(false);
        const coffeeWidgetButton = document.querySelector('#bmc-wbtn')
        coffeeWidgetButton.style.opacity = 0
        coffeeWidgetButton.style.display = "none"

    }

    return (
        <div>
            <IconButton sx={{marginTop: "auto"}} color="primary" onClick={ handleClickOpen }><img src="logo.svg" height="40"></img></IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="about-dialog-title"
                aria-describedby="about-dialog-description"
            >
                <DialogTitle id="about-dialog-title">
                    {"Sippycup v0.0.1"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="about-dialog-description" mb={2}>
                        Sippycup is an in-browser Flask sandbox. To share your code, click the "save" icon, which will create a unique url that links to a snapshot of your current code.
                    </DialogContentText>
                    <Divider />
                    <DialogContentText mt={2} mb={2}>
                        Sippycup was created by <Link underline="hover" target="_blank" rel="noopener" href="https://github.com/travisdoesmath/">@travisdoesmath</Link>, source code is available <Link underline="hover" target="_blank" href="https://github.com/travisdoesmath/sippycup">on github</Link>.
                        
                    </DialogContentText>
                    <Divider />
                    <DialogContentText mt={2}>
                        If you're enjoying Sippycup, consider <Link underline="hover" target="_blank" href="https://www.buymeacoffee.com/travisdoesmath">buying me a coffee</Link>.
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained">OK</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
        
    )
}


