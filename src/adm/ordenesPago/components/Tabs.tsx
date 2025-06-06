import React, { useState } from 'react';
import { Tabs, Tab, Box, Grid } from '@mui/material';
import { tabs } from '../config/tabsOrdenPago'
import { RootState } from "src/store"
import { useSelector } from "react-redux"

const TabsComponent = () => {
    const [value, setValue] = useState('Compromiso')

    const { compromisoSeleccionadoListaDetalle } = useSelector((state: RootState) => state.admOrdenPago)
    const { conFactura } = compromisoSeleccionadoListaDetalle

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue)
    }

    const renderForm = () => {
        const selectedTab = tabs.find(tab => tab.label === value)

        return selectedTab ? selectedTab.component : null;
    }

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    {
                        tabs.map((tab, index) => (
                            tab.show.includes(conFactura ? 'with-invoice' : 'without-invoice') && (
                                <Tab
                                    key={index}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {tab.icon}
                                            <span style={{ marginLeft: '8px' }}>{tab.label}</span>
                                        </Box>
                                    }
                                    value={tab.label}
                                    sx={{
                                        background: value === tab.label ? '#9155FD' : '#e0e0e0',
                                        backgroundColor: '#FFF',
                                        color: 'rgb(39 30 87 / 60%)',
                                        fontWeight: '500',
                                        fontSize: '0.875rem',
                                        margin: '1px 4px',
                                        borderRadius: '5px',
                                        letterSpacing: '0.3px',
                                        '&:hover': {
                                            color: 'white',
                                            backgroundColor: 'rgba(58, 53, 65, 0.1)',
                                            opacity: 1,
                                        }
                                    }}
                                />
                            )
                        ))
                    }
                </Tabs>
            </Box>
            {
                <Grid item sm={12} xs={12} sx={{overflow: 'auto'}}>
                    {renderForm()}
                </Grid>
            }
        </>
    )
}

export default TabsComponent