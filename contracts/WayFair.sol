// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title WayFair
 * @dev Ride-sharing platform on blockchain
 */

contract WayFair {
    
    // State variables
    address public admin;
    uint256 public platformFee;
    uint256 public totalRides;
    
    // Structs
    struct Ride {
        uint256 rideId;
        address driver;
        address passenger;
        uint256 amount;
        uint256 timestamp;
        bool completed;
    }
    
    struct User {
        address userAddress;
        string name;
        uint256 rating;
        uint256 reviewCount;
        bool active;
    }
    
    // Mappings
    mapping(uint256 => Ride) public rides;
    mapping(address => User) public users;
    mapping(address => uint256[]) public userRides;
    mapping(address => uint256) public wallets;
    
    // Events
    event RideCreated(uint256 indexed rideId, address driver, address passenger, uint256 amount);
    event RideCompleted(uint256 indexed rideId, address driver, address passenger, uint256 amount);
    event PaymentProcessed(address indexed from, address indexed to, uint256 amount);
    event UserRegistered(address indexed userAddress, string name);
    event UserRated(address indexed user, uint256 rating);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }
    
    modifier onlyRegistered() {
        require(users[msg.sender].active, "User not registered");
        _;
    }
    
    // Constructor
    constructor() {
        admin = msg.sender;
        platformFee = 10; // 10%
        totalRides = 0;
    }
    
    // Register user
    function registerUser(string memory _name) public {
        require(!users[msg.sender].active, "User already registered");
        
        users[msg.sender] = User({
            userAddress: msg.sender,
            name: _name,
            rating: 0,
            reviewCount: 0,
            active: true
        });
        
        emit UserRegistered(msg.sender, _name);
    }
    
    // Create ride
    function createRide(address _passenger, uint256 _amount) public onlyRegistered returns (uint256) {
        require(users[_passenger].active, "Passenger not registered");
        require(_amount > 0, "Amount must be greater than 0");
        
        totalRides++;
        uint256 rideId = totalRides;
        
        rides[rideId] = Ride({
            rideId: rideId,
            driver: msg.sender,
            passenger: _passenger,
            amount: _amount,
            timestamp: block.timestamp,
            completed: false
        });
        
        userRides[msg.sender].push(rideId);
        userRides[_passenger].push(rideId);
        
        emit RideCreated(rideId, msg.sender, _passenger, _amount);
        return rideId;
    }
    
    // Complete ride and process payment
    function completeRide(uint256 _rideId) public payable returns (bool) {
        Ride storage ride = rides[_rideId];
        require(ride.rideId == _rideId, "Ride not found");
        require(!ride.completed, "Ride already completed");
        require(msg.value == ride.amount, "Incorrect amount sent");
        
        ride.completed = true;
        
        // Calculate fee
        uint256 fee = (ride.amount * platformFee) / 100;
        uint256 driverAmount = ride.amount - fee;
        
        // Transfer to driver
        payable(ride.driver).transfer(driverAmount);
        
        // Add to admin wallet
        wallets[admin] += fee;
        
        emit RideCompleted(_rideId, ride.driver, ride.passenger, ride.amount);
        emit PaymentProcessed(ride.passenger, ride.driver, driverAmount);
        
        return true;
    }
    
    // Rate user
    function rateUser(address _user, uint256 _rating) public onlyRegistered {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        
        User storage user = users[_user];
        user.rating = ((user.rating * user.reviewCount) + _rating) / (user.reviewCount + 1);
        user.reviewCount++;
        
        emit UserRated(_user, _rating);
    }
    
    // Get ride details
    function getRide(uint256 _rideId) public view returns (Ride memory) {
        return rides[_rideId];
    }
    
    // Get user details
    function getUser(address _userAddress) public view returns (User memory) {
        return users[_userAddress];
    }
    
    // Get wallet balance
    function getWalletBalance(address _address) public view returns (uint256) {
        return wallets[_address];
    }
    
    // Withdraw funds (only admin)
    function withdrawFunds(uint256 _amount) public onlyAdmin {
        require(wallets[admin] >= _amount, "Insufficient balance");
        wallets[admin] -= _amount;
        payable(admin).transfer(_amount);
    }
    
    // Get user ride count
    function getUserRideCount(address _user) public view returns (uint256) {
        return userRides[_user].length;
    }
    
    // Set platform fee (only admin)
    function setPlatformFee(uint256 _fee) public onlyAdmin {
        require(_fee >= 0 && _fee <= 50, "Fee must be between 0 and 50%");
        platformFee = _fee;
    }
}
