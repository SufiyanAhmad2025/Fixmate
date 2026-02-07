API Endpoints Documentation

Method Endpoint Description Protected
POST /api/auth/register Register new user/worker No
POST /api/auth/login User login No
GET /api/workers Search/filter workers No
GET /api/workers/:id Get worker details No
PUT /api/workers/:id Update worker profile Yes
POST /api/bookings Create new booking Yes
GET /api/bookings/user Get user's bookings Yes
PUT /api/bookings/:id Update booking status Yes
POST /api/reviews Create review Yes
GET /api/reviews/:workerId Get reviews for worker No
