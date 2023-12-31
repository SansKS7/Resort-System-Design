import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import RoomCard from "../components/BookingCard";
import BookWidget from "../components/BookWidget";
import LoadingSpinner from "../components/LoadingSpinner";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CustomerProfileCard from "../components/CustomerProfileCard";
import PageNotFound from "./PageNotFound";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
// const { rooms } = require("../components/RoomData");
const { isLoggedIn } = require("../components/UserFunctions");
const { displayError, displaySuccess } = require("../components/NotifyToast");
const { API_availableRooms } = require("../api/index");
const { fetchAPI } = require("../components/UserFunctions");
const { API_roomBookProcess,API_roomNotification } = require("../api/index");

const headerData = {
  title: "Book Now",
  sub_title:
    "Book your blissful escape now! Discover luxury, reserve memories. Your dream stay awaits at our resort.",
  image: "room_header.jpg",
};
export default function Rooms(props) {
  const [loggedIn, setLogin] = useState(isLoggedIn());
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const [checkAvailability, setCheckAvailability] = useState({
    checkInDate: new Date(),
    checkOutDate: new Date(),
    totalDays: 1,
    adults: 1,
    childrens: 0,
  });
  const [booking, setBooking] = useState({
    customerId: null,
    // paymentId: null,
    roomId: null,
    serviceType: "Room", // Type of service being booked (e.g., hotel, flight, event)
    serviceDetails: "Booking Of Rooms", // Details about the specific service being booked
    adults: checkAvailability.adults, // Number of adults included in the booking
    childrens: checkAvailability.childrens, // Number of children included in the booking
    checkInDate: checkAvailability.checkInDate, // Date of check-in for the service
    checkOutDate: checkAvailability.checkOutDate, // Date of check-out for the service
    totalDays: checkAvailability.totalDays,
    dateOfBooking: null, // Date when the booking was made
    bookingStatus: "Pending", // Status of the booking (e.g., Pending, Confirmed, Canceled)
    paymentStatus: "Pending", // Status of the payment associated with the booking
  });

  // Insert Notification Entry
  async function setRoomNotification(roomId) {
    setLoading(true);
    const respones = await fetchAPI(roomId, API_roomNotification, "POST");
    const json = await respones.json();
    if (respones.status == 200) {
      displaySuccess(json.message);
      // setNotificationData(notificationData);
    } else {
      displayError(json.message);
    }
    // console.log(roomId);
    setLoading(false);
  }

  async function getAvailableRooms(data) {
    setLoading(true);
    const respones = await fetchAPI(data, API_availableRooms, "POST");
    const json = await respones.json();
    // console.log(json);
    setLoading(false);
    setRooms(json);
  }

  async function roomBookProcess(data) {
    setLoading(true);
    const respones = await fetchAPI(data, API_roomBookProcess, "POST");
    const json = await respones.json();
    setLoading(false);
    if (!json.success) {
      return false;
    } else {
      navigate("/rooms/bookingProcess", {
        state: {
          ...json._doc,
        },
      });
      console.log(json);
      return true;
    }
  }

  function handleCheckAvailability(data) {
    setCheckAvailability({
      ...checkAvailability,
      ...data,
    });
  }
  function handleBookRoom(data) {
    setBooking({
      ...booking,
      ...checkAvailability,
      roomId: data._id,
    });
  }
  function handleNotifyClick(roomId) {
    setRoomNotification({roomId});
  }
  useEffect(() => {
    getAvailableRooms(checkAvailability);
    // console.log(checkAvailability);
  }, [checkAvailability]);

  useEffect(() => {
    // console.log(booking);
    if (booking.roomId != null) {
      roomBookProcess(booking);
    }
  }, [booking]);
  return (
    <Fragment>
      <Navbar />

      {loggedIn ? (
        <Fragment>
          {loading ? <LoadingSpinner /> : null}
          <Header data={headerData} />
          <BookWidget handleCheckAvailability={handleCheckAvailability} />
          {/* {console.log(rooms)} */}
          {rooms.length === 0 ? (
            <h1></h1>
          ) : (
            rooms.map((room, key) => (
              <RoomCard
                key={key}
                room={room}
                totalDays={checkAvailability.totalDays}
                handleBookRoom={handleBookRoom}
                handleNotifyClick={handleNotifyClick}
              />
            ))
          )}
          <ToastContainer />
          <Footer></Footer>
        </Fragment>
      ) : (
        <PageNotFound></PageNotFound>
      )}
    </Fragment>
  );
}
