# Analytics Integration - Frontend

This document describes the analytics integration implemented in the frontend to work with the comprehensive analytics APIs from the Burning Sawals backend.

## 🚀 Features Implemented

### 1. **Comprehensive Analytics Dashboard**
- **Overview Tab**: System health, database status, user counts, and personal analytics summary
- **Questions Tab**: Detailed question analytics with sorting and filtering capabilities
- **Users Tab**: User interaction analytics and engagement metrics
- **Top Questions Tab**: Most popular questions based on interactions

### 2. **API Integration**
- Full integration with all analytics endpoints from the backend
- Proper error handling and loading states
- Real-time data refresh functionality
- Responsive design for all screen sizes

### 3. **Data Visualization**
- Interactive tables with sortable columns
- Color-coded metrics (likes in green, super likes in orange, dislikes in red)
- System health indicators with visual status
- Genre tags for questions
- Pagination support for large datasets

## 📊 Analytics Data Displayed

### System Overview
- Total users count
- Total questions count
- Total interactions across the platform
- Daily active users
- System health status
- Database connection status

### Question Analytics
- Question text and prompts
- Associated genres and question types
- Like, super like, and dislike counts
- Total interaction metrics
- Creation dates
- Sortable by any metric

### User Analytics
- Personal interaction summary
- Likes given by the user
- Super likes given by the user
- Dislikes given by the user
- Total interactions given
- Last activity timestamp

### Top Questions
- Ranked list of most popular questions
- Visual ranking indicators
- Complete interaction breakdown
- Genre categorization
- Responsive card layout

## 🔧 Technical Implementation

### API Service (`src/utils/api.ts`)
```typescript
export class AnalyticsService {
  // Question Interactions
  static async addQuestionInteraction(questionId, interactionType, token)
  static async removeQuestionInteraction(questionId, interactionType, token)
  static async getUserInteractionsForQuestion(questionId, token)
  
  // Question Analytics
  static async getQuestionAnalytics(questionId, token)
  static async getAllQuestionsWithAnalytics(token, page, limit, sortBy, sortOrder)
  
  // User Analytics
  static async getUserAnalytics(token)
  static async getUserInteractionHistory(token, page, limit)
  
  // Top Questions
  static async getTopQuestions(token, type, limit)
  
  // Monitoring
  static async getSystemHealth(token)
  static async getDailyStats(token)
  static async getMetrics(token)
}
```

### Analytics Page (`src/app/analytics/page.tsx`)
- **State Management**: React hooks for managing data, loading, and error states
- **Tab Navigation**: Clean tab-based interface for different analytics views
- **Data Fetching**: Parallel API calls for optimal performance
- **Error Handling**: Graceful error handling with user-friendly messages
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🎨 UI Components

### Overview Tab
- System metrics cards with large numbers
- Health status indicators with colored dots
- Personal analytics summary grid
- Real-time system status

### Questions Tab
- Sortable data table with all question metrics
- Genre tags with overflow handling
- Question text truncation for better layout
- Interactive sorting controls

### Users Tab
- Personal analytics dashboard
- Large metric displays
- Last updated timestamp
- Clean, focused layout

### Top Questions Tab
- Ranked question cards
- Visual ranking indicators
- Complete interaction breakdown
- Genre categorization

## 🔄 Data Flow

1. **Authentication Check**: Verify user is logged in
2. **Parallel API Calls**: Fetch all analytics data simultaneously
3. **Data Processing**: Transform API responses into UI-friendly format
4. **State Updates**: Update React state with processed data
5. **UI Rendering**: Display data in appropriate components
6. **Error Handling**: Show user-friendly error messages if APIs fail

## 🚀 Usage

1. **Navigate to Analytics**: Go to `/admin/analytics` (requires authentication)
2. **View Overview**: See system health and personal metrics
3. **Browse Questions**: Sort and filter question analytics
4. **Check User Stats**: View personal interaction history
5. **Explore Top Questions**: See most popular content
6. **Refresh Data**: Click refresh button to get latest data

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### Backend Requirements
- Analytics API endpoints must be available
- JWT authentication required
- CORS configured for frontend domain

## 🐛 Error Handling

- **Network Errors**: Graceful fallback with retry options
- **Authentication Errors**: Redirect to login if token invalid
- **API Errors**: User-friendly error messages
- **Loading States**: Spinner and loading indicators
- **Empty States**: Appropriate messages when no data available

## 📱 Responsive Design

- **Mobile**: Single column layout with touch-friendly controls
- **Tablet**: Two-column grid for metrics
- **Desktop**: Full multi-column layout with sidebar navigation
- **Large Screens**: Optimized spacing and typography

## 🔮 Future Enhancements

- **Real-time Updates**: WebSocket integration for live data
- **Charts and Graphs**: Data visualization with Chart.js or D3
- **Export Functionality**: CSV/PDF export of analytics data
- **Advanced Filtering**: Date ranges, genre filters, user filters
- **Caching**: Local storage for better performance
- **Pagination**: Handle large datasets efficiently

## 🧪 Testing

The analytics integration includes:
- Error boundary handling
- Loading state management
- API response validation
- Responsive design testing
- Authentication flow testing

## 📝 Notes

- All API calls include proper authentication headers
- Data is fetched in parallel for optimal performance
- Error states are handled gracefully with user feedback
- The interface is fully responsive and accessible
- Code is well-documented and maintainable
