import { useState, useEffect } from 'react';
import { Card, Button, Tag, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

const SeatMap = ({ trip, selectedSeats = [], onSeatSelect, maxSeats = 5 }) => {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    // Generate seat layout based on bus type
    const totalSeats = trip?.bus?.totalSeats || 40;
    const busType = trip?.bus?.busType || 'Giường nằm';

    // Create seat array
    const seatArray = [];
    let seatNumber = 1;

    // Layout for different bus types
    if (busType === 'Giường nằm' || busType === 'Limousine') {
      // 2 rows, each row has 2 seats per side
      const rows = Math.ceil(totalSeats / 4);
      for (let row = 0; row < rows; row++) {
        const rowSeats = [];
        for (let col = 0; col < 4; col++) {
          if (seatNumber <= totalSeats) {
            rowSeats.push({
              number: seatNumber,
              row,
              col,
              floor: Math.floor(row / (rows / 2)),
            });
            seatNumber++;
          }
        }
        seatArray.push(rowSeats);
      }
    } else {
      // Regular bus - 4 seats per row
      const rows = Math.ceil(totalSeats / 4);
      for (let row = 0; row < rows; row++) {
        const rowSeats = [];
        for (let col = 0; col < 4; col++) {
          if (seatNumber <= totalSeats) {
            rowSeats.push({
              number: seatNumber,
              row,
              col,
            });
            seatNumber++;
          }
        }
        seatArray.push(rowSeats);
      }
    }

    setSeats(seatArray);
  }, [trip]);

  const getSeatStatus = (seatNumber) => {
    if (trip?.bookedSeats?.includes(seatNumber)) {
      return 'booked';
    }
    if (trip?.lockedSeats?.some(lock => lock.seatNumber === seatNumber)) {
      return 'locked';
    }
    if (selectedSeats.includes(seatNumber)) {
      return 'selected';
    }
    return 'available';
  };

  const handleSeatClick = (seatNumber) => {
    const status = getSeatStatus(seatNumber);

    if (status === 'booked' || status === 'locked') {
      message.warning('Ghế này đã được đặt!');
      return;
    }

    if (status === 'selected') {
      // Deselect
      onSeatSelect(selectedSeats.filter(s => s !== seatNumber));
    } else {
      // Select
      if (selectedSeats.length >= maxSeats) {
        message.warning(`Bạn chỉ có thể chọn tối đa ${maxSeats} ghế!`);
        return;
      }
      onSeatSelect([...selectedSeats, seatNumber]);
    }
  };

  const getSeatClass = (seatNumber) => {
    const status = getSeatStatus(seatNumber);
    const baseClass = 'w-12 h-12 m-1 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-200';

    switch (status) {
      case 'booked':
        return `${baseClass} bg-gray-300 text-gray-500 cursor-not-allowed`;
      case 'locked':
        return `${baseClass} bg-gray-200 text-gray-400 cursor-not-allowed`;
      case 'selected':
        return `${baseClass} bg-blue-600 text-white scale-105 shadow-lg`;
      case 'available':
        return `${baseClass} bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105`;
      default:
        return baseClass;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <Card
      title={
        <div>
          <h3 className="text-lg font-semibold">Chọn ghế</h3>
          <p className="text-sm font-normal text-gray-600 mt-1">
            Đã chọn: {selectedSeats.length}/{maxSeats} ghế
          </p>
        </div>
      }
      extra={
        <div className="text-right">
          <div className="text-sm text-gray-600">Tổng tiền</div>
          <div className="text-xl font-bold text-blue-600">
            {formatPrice(selectedSeats.length * (trip?.basePrice || trip?.baseFare || 0))}
          </div>
        </div>
      }
    >
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-100 rounded mr-2"></div>
          <span className="text-sm">Còn trống</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded mr-2"></div>
          <span className="text-sm">Đang chọn</span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded mr-2"></div>
          <span className="text-sm">Đã đặt</span>
        </div>
      </div>

      {/* Driver indicator */}
      <div className="mb-4">
        <div className="w-16 h-12 bg-gray-700 text-white rounded-t-2xl flex items-center justify-center mx-auto">
          <span className="text-xs">Tài xế</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="flex flex-col items-center">
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            {row.map((seat) => (
              <div key={seat.number} className="relative">
                {seat.col === 2 && (
                  <div className="w-8 inline-block"></div> // Aisle
                )}
                <button
                  className={getSeatClass(seat.number)}
                  onClick={() => handleSeatClick(seat.number)}
                  disabled={
                    getSeatStatus(seat.number) === 'booked' ||
                    getSeatStatus(seat.number) === 'locked'
                  }
                >
                  {seat.number}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Ghế đã chọn: </span>
              {selectedSeats.map((seat, index) => (
                <Tag key={seat} color="blue" className="mr-1">
                  {seat}
                </Tag>
              ))}
            </div>
            <Button
              type="link"
              onClick={() => onSeatSelect([])}
              className="text-red-600"
            >
              Bỏ chọn tất cả
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SeatMap;
