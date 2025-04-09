export const users = [
  {
    id: 1,
    username: "foodie123",
    password: "hashed_password_1",
  },
  {
    id: 2,
    username: "streetlover",
    password: "hashed_password_2",
  },
  {
    id: 3,
    username: "spicyking",
    password: "hashed_password_3",
  },
];

export const spots = [
  {
    id: 1,
    name: "Chai Point",
    description: "Famous for its cutting chai and biscuits",
    bestItem: "Masala Chai",
    image:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    latitude: 17.39275,
    longitude: 78.32875,
    createdAt: "2025-02-09T10:00:00Z",
    createdBy: 1,
    popular: true,
  },
  {
    id: 2,
    name: "Tandoori Junction",
    description: "Best tandoori dishes in town",
    bestItem: "Tandoori Chicken",
    image:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    latitude: 17.3975,
    longitude: 78.336,
    createdAt: "2025-02-09T10:05:00Z",
    createdBy: 2,
    popular: false,
  },
  {
    id: 3,
    name: "Biryani Hub",
    description: "Authentic Hyderabadi Dum Biryani",
    bestItem: "Mutton Biryani",
    image:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    latitude: 17.4025,
    longitude: 78.3395,
    createdAt: "2025-02-09T10:10:00Z",
    createdBy: 3,
    popular: true,
  },
];

export const menuItems = [
  {
    id: 1,
    spotId: 1,
    name: "Masala Chai",
    price: 30.0,
    image:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Strong tea with aromatic spices",
  },
  {
    id: 2,
    spotId: 1,
    name: "Bun Maska",
    price: 25.0,
    image:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Soft bun with butter and sugar",
  },
  {
    id: 3,
    spotId: 2,
    name: "Tandoori Chicken",
    price: 180.0,
    image:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Spicy and smoky grilled chicken",
  },
  {
    id: 4,
    spotId: 2,
    name: "Paneer Tikka",
    price: 150.0,
    image:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Grilled paneer cubes with spices",
  },
  {
    id: 5,
    spotId: 3,
    name: "Mutton Biryani",
    price: 250.0,
    image:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Slow-cooked Hyderabadi mutton biryani",
  },
  {
    id: 6,
    spotId: 3,
    name: "Chicken Biryani",
    price: 200.0,
    image:
      "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Delicious chicken dum biryani",
  },
];

export const reviews = [
  {
    id: 1,
    spotId: 1,
    userId: 2,
    rating: 5,
    comment: "Best chai in town!",
    createdAt: "2025-02-09T12:00:00Z",
  },
  {
    id: 2,
    spotId: 2,
    userId: 3,
    rating: 4,
    comment: "Loved the Tandoori Chicken, but a bit spicy!",
    createdAt: "2025-02-09T12:10:00Z",
  },
  {
    id: 3,
    spotId: 3,
    userId: 1,
    rating: 5,
    comment: "Authentic Hyderabadi taste, just amazing!",
    createdAt: "2025-02-09T12:20:00Z",
  },
];
