const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};



const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotel.models");

app.use(cors(corsOptions));
app.use(express.json());
initializeDatabase();

// create a new Hotel data
async function createHotel(hotelData){
  try {
    const newHotel = new Hotel(hotelData)
    const savedHotel = await newHotel.save()
    return savedHotel
  } catch (error) {
    throw error
  }
}

app.post("/hotels", async (req, res) => {
  try {
    const hotel = await createHotel(req.body)
    res.json({message: "Hotel added successfully", hotel: hotel})
  } catch (error) {
    res.status(500).json({error: "Failed to add hotel", errorType: error})
  }
})

// read all hotels from database

async function readAllHotels() {
  try {
    const allHotels = await Hotel.find();
    return allHotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if (hotels.length != 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No hotel found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

// get Hotel by its name:
async function readHotelByName(hotelName) {
  try {
    const hotel = await Hotel.findOne({ name: hotelName });
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await readHotelByName(req.params.hotelName);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Failed to fetch hotel" });
  }
});

// read hotel by phone number
async function readHotelByPhoneNumber(contactNumber) {
  try {
    const hotel = await Hotel.findOne({ phoneNumber: contactNumber });
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await readHotelByPhoneNumber(req.params.phoneNumber)
    if(hotel){
      res.json(hotel)
    } else {
      res.status(404).json({error: "Restaurant not found"})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch restaurant"})
  }
});

// read hotels by rating:
async function readHotelsByRating(ratingValue) {
  try {
    const hotels = await Hotel.find({ rating: ratingValue });
    return hotels
  } catch (error) {
    throw error 
  }
}

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await readHotelsByRating(req.params.hotelRating)
    if(hotels.length != 0){
      res.json(hotels)
    } else {
      res.status(404).json({error: "No hotel found"})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch hotel"})
  }
})

// read hotels by category:

async function readHotelsByCategory(category) {
  try {
    const hotelsByCategory = await Hotel.find({ category: category });
    return hotelsByCategory
  } catch (error) {
    throw error
  }
}

app.get("/hotels/category/:categoryName", async (req, res) => {
  try {
    const hotels = await readHotelsByCategory(req.params.categoryName)
    if(hotels.length != 0){
      res.json(hotels)
    } else {
      res.status(404).json({error: "No hotel found"})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch hotels"})
  }
})

// delete hotel

async function deleteHotel(hotelId){
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
    return deletedHotel
  } catch (error) {
    throw error
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotel(req.params.hotelId)
    if(deleteHotel){
      res.status(200).json({message: "Hotel deleted successfully"})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to delete hotel"})
  }
})

// update hotel data

async function updateHotelById(hotelId, dataToUpdate){
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {new: true})
    return updatedHotel
  } catch (error) {
    throw error
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotelById(req.params.hotelId, req.body)
    updatedHotel && res.status(200).json({message: "Hotel updated successfully", hotel: updatedHotel})
  } catch (error) {
    res.status(500).json({error: "Failed to update hotel"})
  }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
