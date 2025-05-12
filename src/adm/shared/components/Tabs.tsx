import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Grid } from '@mui/material';
interface TabsComponentProps {
    tabs: Array<{
        label: string
        icon?: React.ReactNode
        component: React.ReactNode
        show: string[]
    }>
    hasInvoice?: boolean
    initialTab?: string
}

const TabsComponent: React.FC<TabsComponentProps> = ({ tabs, hasInvoice, initialTab }) => {
    const visibleTabs = hasInvoice !== undefined
        ? tabs.filter(tab => tab.show?.includes(hasInvoice ? 'with-invoice' : 'without-invoice'))
        : tabs

    const findValidInitialTab = () => {
        if (initialTab && visibleTabs.some(tab => tab.label === initialTab)) {

            return initialTab
        }
        return visibleTabs.length > 0 ? visibleTabs[0].label : '';
    };

    const [value, setValue] = useState(findValidInitialTab());

    useEffect(() => {
        if (!visibleTabs.some(tab => tab.label === value)) {
            setValue(findValidInitialTab())
        }
    }, [visibleTabs])

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue)
    };

    const renderForm = () => {
        const selectedTab = visibleTabs.find(tab => tab.label === value);
        return selectedTab ? selectedTab.component : null
    }

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={visibleTabs.some(tab => tab.label === value) ? value : false}
                    onChange={handleChange}
                    variant="fullWidth"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    {visibleTabs.map((tab, index) => (
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
                    ))}
                </Tabs>
            </Box>
            <Grid item sm={12} xs={12} sx={{ overflow: 'auto' }}>
                {renderForm()}
            </Grid>
        </>
    );
}

export default TabsComponent