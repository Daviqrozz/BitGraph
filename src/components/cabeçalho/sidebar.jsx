import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './header.css';

export default function Side() {
    const [visible, setVisible] = useState(true);

    return (
        <div className='Header d-flex justify-content-between align-items-center' style={{ height: '100vh' }}>
            <div className="d-flex align-items-center">

                <Button onClick={() => setVisible(true)} className="p-button-text">
                    <svg style={{ visibility: visible ? 'hidden' : 'visible' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-list" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                    </svg>
                </Button>
            </div>

            <div className="d-flex align-items-center">

                <Sidebar visible={visible} onHide={() => setVisible(false)} style={{ backgroundColor: 'transparent', color: 'white', marginTop: '0px' }}>
                    
                    <div>
                        <div className='text-center '>
                            <h1 style={{ color: 'white',marginTop:'20px'}}>Menu</h1>
                        </div>

                        <ul style={{ listStyleType: 'none', padding: 0 }}>

                            <li style={{ marginBottom: '5px',marginTop:35 }}>
                                <Button label="ㅤHome"
                                    icon="pi pi-home"
                                    onClick={() => window.location.href = '/'}
                                    style={{ backgroundColor: 'transparent', border: 'black', color: 'white' }} />
                            </li>

                            <hr />
                            <li style={{ marginBottom: '5px' }}>
                                <Button label="ㅤAbout"
                                    icon="pi pi-bitcoin"
                                    onClick={() => window.location.href = '/coins'}
                                    style={{ backgroundColor: 'transparent', border: 'black', color: 'white' }} />
                            </li>

                            <hr />
                            <li style={{ marginBottom: '5px' }}>
                                <Button label="ㅤContact"
                                    icon="pi pi-search"
                                    onClick={() => window.location.href = '/contact'}
                                    style={{ backgroundColor: 'transparent', border: 'black', color: 'white' }} />
                            </li>

                        </ul>
                    </div>

                </Sidebar>
            </div>

        </div>
    )
}
