// src/components/RouteList.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { ref, onValue, off, remove } from 'firebase/database';

// The prop being passed in is 'onEdit', so we destructure it here.
const RouteList = ({ onEdit }) => {
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);

    useEffect(() => {
        const routesRef = ref(db, 'routes6')
        const listener = onValue(routesRef, (snapshot) => {
            const data = snapshot.val();
            const routesArray = data
                ? Object.keys(data).map(key => ({ id: key, ...data[key] })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                : [];
            setRoutes(routesArray);
        });

        return () => off(routesRef, 'value', listener);
    }, []);

    const handleDelete = (routeId) => {
        if (window.confirm('Are you sure you want to delete this route?')) {
            const routeRef = ref(db, `routes6/${routeId}`);
            remove(routeRef)
                .then(() => {
                    alert('Route deleted successfully!');
                    if (selectedRoute?.id === routeId) {
                        setSelectedRoute(null);
                    }
                })
                .catch((error) => {
                    alert('Failed to delete route.');
                    console.error('Error deleting route: ', error);
                });
        }
    };

    return (
        <div className="route-list-panel">
            <h2>Saved Routes</h2>
            <div className="route-list">
                {routes.length > 0 ? (
                    routes.map(route => (
                        <div
                            key={route.id}
                            className={`route-item ${selectedRoute?.id === route.id ? 'selected' : ''}`}
                        >
                            <span className="route-name" onClick={() => setSelectedRoute(route)}>
                                {route.name}
                            </span>
                            <div className="route-actions">
                                {/* CORRECTED LINE: Changed setEditingRoute to onEdit */}
                                <button onClick={() => onEdit(route)} className="edit">Edit</button>
                                <button onClick={() => handleDelete(route.id)} className="delete">Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No routes saved yet.</p>
                )}
            </div>
            {selectedRoute && (
                <div className="selected-route-details">
                    <h3>Details for "{selectedRoute.name}"</h3>
                    <ul>
                        {selectedRoute.moves.map((move, index) => (
                            <li key={index}>
                                {index + 1}. Move {move.direction} for {move.duration} seconds.
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RouteList;
