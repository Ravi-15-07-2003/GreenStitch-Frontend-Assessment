import React, { useState } from 'react';
import './SeatBooking.css';

const SEAT_STATUS = {
    AVAILABLE: 'available',
    SELECTED: 'selected',
    BOOKED: 'booked'
};

const SEAT_PRICES = {
    PREMIUM: 1000,  // Rows A-C (0-2)
    STANDARD: 750,  // Rows D-F (3-5)
    ECONOMY: 500    // Rows G-H (6-7)
};

const MAX_SEATS_PER_BOOKING = 8;

const SeatBooking = () => {
    const ROWS = 8;
    const SEATS_PER_ROW = 10;

    const initializeSeats = () => {
        const seats = [];
        for (let row = 0; row < ROWS; row++) {
            const rowSeats = [];
            for (let seat = 0; seat < SEATS_PER_ROW; seat++) {
                rowSeats.push({
                    id: `${row}-${seat}`,
                    row: row,
                    seat: seat,
                    status: SEAT_STATUS.AVAILABLE
                });
            }
            seats.push(rowSeats);
        }
        return seats;
    };

    const [seats, setSeats] = useState(initializeSeats());

    // TODO: Implement all required functionality below

    const getSeatPrice = (row) => { return 0; };
    const getSelectedCount = () => { return 0; };
    const getBookedCount = () => { return 0; };
    const getAvailableCount = () => { return 0; };
    const calculateTotalPrice = () => { return 0; };

    const handleSeatClick = (row, seat) => {
        // TODO: Implement seat selection logic
    };

    const handleBookSeats = () => {
        // TODO: Implement booking logic
    };

    const handleClearSelection = () => {
        // TODO: Implement clear selection logic
    };

    const handleReset = () => {
        // TODO: Implement reset logic
    };

    return (
        <div
            className="seat-booking-container"
            id="seat-booking-container"
            data-testid="seat-booking-container"
        >
            <h1 data-testid="app-title">GreenStitch Seat Booking System</h1>

            <div className="info-panel" data-testid="info-panel">
                <div className="info-item" data-testid="available-info">
                    <span className="info-label">Available:</span>
                    <span className="info-value" data-testid="available-count">
                        {getAvailableCount()}
                    </span>
                </div>
                <div className="info-item" data-testid="selected-info">
                    <span className="info-label">Selected:</span>
                    <span className="info-value" data-testid="selected-count">
                        {getSelectedCount()}
                    </span>
                </div>
                <div className="info-item" data-testid="booked-info">
                    <span className="info-label">Booked:</span>
                    <span className="info-value" data-testid="booked-count">
                        {getBookedCount()}
                    </span>
                </div>
            </div>

            <div className="legend" data-testid="legend">
                <div className="legend-item" data-testid="legend-available">
                    <div className="seat-demo available"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item" data-testid="legend-selected">
                    <div className="seat-demo selected"></div>
                    <span>Selected</span>
                </div>
                <div className="legend-item" data-testid="legend-booked">
                    <div className="seat-demo booked"></div>
                    <span>Booked</span>
                </div>
            </div>

            <div className="seat-grid" data-testid="seat-grid">
                {seats.map((row, rowIndex) => {
                    const rowLabel = String.fromCharCode(65 + rowIndex);
                    return (
                        <div
                            key={rowIndex}
                            className="seat-row"
                            data-testid={`seat-row-${rowLabel}`}
                            data-row-index={rowIndex}
                        >
                            <div
                                className="row-label"
                                data-testid={`row-label-${rowLabel}`}
                            >
                                {rowLabel}
                            </div>
                            {row.map((seat, seatIndex) => (
                                <div
                                    key={seat.id}
                                    id={`seat-${seat.id}`}
                                    className={`seat ${seat.status}`}
                                    data-testid="seat"
                                    data-seat-id={seat.id}
                                    data-seat-row={rowLabel}
                                    data-seat-number={seatIndex + 1}
                                    data-seat-status={seat.status}
                                    onClick={() => handleSeatClick(rowIndex, seatIndex)}
                                >
                                    {seatIndex + 1}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            <div className="pricing-info" data-testid="pricing-info">
                <p data-testid="selected-total">
                    Selected Seats Total:{' '}
                    <strong data-testid="total-price">₹{calculateTotalPrice()}</strong>
                </p>
                <p className="price-note" data-testid="price-note">
                    Premium (A-C): ₹1000 | Standard (D-F): ₹750 | Economy (G-H): ₹500
                </p>
            </div>

            <div className="control-panel" data-testid="control-panel">
                <button
                    className="btn btn-book"
                    id="book-seats-button"
                    data-testid="book-seats-button"
                    onClick={handleBookSeats}
                    disabled={getSelectedCount() === 0}
                >
                    Book Selected Seats ({getSelectedCount()})
                </button>
                <button
                    className="btn btn-clear"
                    id="clear-selection-button"
                    data-testid="clear-selection-button"
                    onClick={handleClearSelection}
                    disabled={getSelectedCount() === 0}
                >
                    Clear Selection
                </button>
                <button
                    className="btn btn-reset"
                    id="reset-all-button"
                    data-testid="reset-all-button"
                    onClick={handleReset}
                >
                    Reset All
                </button>
            </div>
        </div>
    );
};

export default SeatBooking;
