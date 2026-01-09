import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
    const saved = localStorage.getItem('bookedSeats');
    if (saved) {
        const bookedIds = JSON.parse(saved);
        setSeats(prev =>
            prev.map(row =>
                row.map(seat =>
                    bookedIds.includes(seat.id)
                        ? { ...seat, status: SEAT_STATUS.BOOKED }
                        : seat
                )
            )
        );
    }
}, []);


    const getSeatPrice = (row) => { 
        if (row <= 2) return SEAT_PRICES.PREMIUM;
        if (row <= 5) return SEAT_PRICES.STANDARD;
        return SEAT_PRICES.ECONOMY;
     };
    const getSelectedCount = () => seats.flat().filter(s => s.status === SEAT_STATUS.SELECTED).length;
     
    const getBookedCount = () => seats.flat().filter(s => s.status === SEAT_STATUS.BOOKED).length; 
    
    const getAvailableCount = () => seats.flat().filter(s => s.status === SEAT_STATUS.AVAILABLE).length;

    const calculateTotalPrice = () =>  seats.flat().reduce((sum, seat) => {
        if (seat.status === SEAT_STATUS.SELECTED) {
            return sum + getSeatPrice(seat.row);
        }
        return sum;
    }, 0);

    const isContinuityValidForRow = (rowSeats, currentIndex) => {
    // Get all selected seat indexes in this row
    const selectedIndexes = rowSeats
        .map((seat, index) =>
            seat.status === SEAT_STATUS.SELECTED ? index : null
        )
        .filter(index => index !== null);

    // a) If only one selected seat, continuity is always valid
    if (selectedIndexes.length <= 1) return true;

    // b) Check LEFT direction from currentIndex
    for (let i = currentIndex - 1; i >= 0; i--) {
        const status = rowSeats[i].status;

        if (status === SEAT_STATUS.BOOKED) continue; // ignore booked
        if (status === SEAT_STATUS.SELECTED) return true; // continuity satisfied
        if (status === SEAT_STATUS.AVAILABLE) break; // blocked by available
    }

    // c) Check RIGHT direction from currentIndex
    for (let i = currentIndex + 1; i < rowSeats.length; i++) {
        const status = rowSeats[i].status;

        if (status === SEAT_STATUS.BOOKED) continue; // ignore booked
        if (status === SEAT_STATUS.SELECTED) return true; // continuity satisfied
        if (status === SEAT_STATUS.AVAILABLE) break; // blocked by available
    }

    // d) No selected seat reachable without crossing AVAILABLE
    return false;
};




    const handleSeatClick = (row, seat) => {
        // TODO: Implement seat selection logic
        setSeats(prev => {
        const copy = prev.map(r => r.map(s => ({ ...s })));
        const current = copy[row][seat];

        if (current.status === SEAT_STATUS.BOOKED) return prev;

        if (
            current.status === SEAT_STATUS.AVAILABLE &&
            getSelectedCount() >= MAX_SEATS_PER_BOOKING
        ) {
            alert('You can book a maximum of 8 seats.');
            return prev;
        }

        current.status =
            current.status === SEAT_STATUS.SELECTED
                ? SEAT_STATUS.AVAILABLE
                : SEAT_STATUS.SELECTED;

        if (
           current.status === SEAT_STATUS.SELECTED &&
           !isContinuityValidForRow(copy[row], seat)
            ) {
            alert('Seat selection must be continuous.');
            return prev;
               }


        return copy;
    });
    };

    const handleBookSeats = () => {
        // TODO: Implement booking logic
        const selectedSeats = seats.flat().filter(s => s.status === SEAT_STATUS.SELECTED);
    const count = selectedSeats.length;
    const total = calculateTotalPrice();

    if (
        !window.confirm(
            `Confirm booking?\nSeats: ${count}\nTotal Price: ₹${total}`
        )
    ) return;

    setSeats(prev => {
        const updated = prev.map(row =>
            row.map(seat =>
                seat.status === SEAT_STATUS.SELECTED
                    ? { ...seat, status: SEAT_STATUS.BOOKED }
                    : seat
            )
        );

        const bookedIds = updated
            .flat()
            .filter(s => s.status === SEAT_STATUS.BOOKED)
            .map(s => s.id);

        localStorage.setItem('bookedSeats', JSON.stringify(bookedIds));
        return updated;
    });
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
