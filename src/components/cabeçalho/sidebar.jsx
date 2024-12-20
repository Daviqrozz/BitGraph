import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function Side() {
    const [visible, setVisible] = useState(false);
    
    return (

        <div className='Header d-flex justify-content-between align-items-center'>
            <div className="d-flex align-items-center">
                <Button onClick={() => setVisible(true)} className="p-button-text">

                        <svg style={{visibility: visible ? 'hidden' : 'visible'}} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-list" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                        </svg>
                    
                </Button>
            </div>

            <div className="d-flex align-items-center">

                <Sidebar visible={visible} onHide={() => setVisible(false)} style={{ backgroundColor: 'transparent', color: 'white', paddingTop:0}}>
                    <div>
                        <h1 style={{ color: 'white' }}>Menu</h1>
                        <hr />
                    </div>

                    <ul style={{ listStyleType: 'none', padding: 0 }}>

                        <li style={{ marginBottom: '5px' }}>
                            <Button label="Home"
                                icon="pi pi-bitcoin"
                                onClick={() => window.location.href = '/home'}
                                style={{ backgroundColor: 'transparent', border: 'black', color: 'white' }} />
                        </li>

                        <hr />
                        <li style={{ marginBottom: '5px' }}>
                            <Button label="About"
                                icon="pi pi-spin pi-spinner"
                                onClick={() => window.location.href = '/about'}
                                style={{ backgroundColor: 'transparent', border: 'black', color: 'white' }} />
                        </li>

                        <hr />
                        <li style={{ marginBottom: '5px' }}>
                            <Button label="Contact"
                                icon="pi pi-search"
                                onClick={() => window.location.href = '/contact'}
                                style={{ backgroundColor: 'transparent', border: 'black', color: 'white' }} />
                        </li>

                    </ul>
                </Sidebar>
            </div>

        </div>
    )
}
