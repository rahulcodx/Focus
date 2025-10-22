import { NextRequest, NextResponse } from 'next/server';
import { TaskModel } from '@/lib/models/Task';
import { SessionModel } from '@/lib/models/Session';
import { GoalModel } from '@/lib/models/Goal';
import { NoteModel } from '@/lib/models/Note';
import { UserModel } from '@/lib/models/User';
import { getSecurityHeaders } from '@/lib/auth-edge';
import { getUserIdFromRequest } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    // Fetch all statistics in parallel for better performance
    const [
      taskStats,
      sessionStats,
      goalStats,
      noteStats,
      activityData,
      leaderboardData,
      user
    ] = await Promise.all([
      TaskModel.getStats(userId),
      SessionModel.getStats(userId),
      GoalModel.getStats(userId),
      NoteModel.getStats(userId),
      SessionModel.getActivityData(userId, 49), // 7 weeks for heatmap
      UserModel.getLeaderboard(10), // Top 10 users
      UserModel.findById(userId)
    ]);

    // Calculate user ranking
    const userRank = leaderboardData.findIndex(user => user._id?.toString() === userId) + 1;

    // Format focus time for display
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return hours > 0 ? `${hours}.${Math.floor(minutes/6)}h` : `${minutes}m`;
    };

    const liveTodaySeconds = (user?.stats as any)?.liveTodayFocusTime || 0;
    const liveDate = (user?.stats as any)?.liveTodayDate;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayFocusWithLive = liveDate === todayStr 
      ? (sessionStats.todayFocusTime || 0) + liveTodaySeconds 
      : sessionStats.todayFocusTime || 0;

    const dashboardStats = {
      // Today's key metrics
      today: {
        tasksCompleted: taskStats.todayCompleted,
        totalTasks: taskStats.pending + taskStats.completed,
        focusTime: todayFocusWithLive,
        focusTimeFormatted: formatTime(todayFocusWithLive),
        sessions: sessionStats.totalSessions > 0 ? Math.floor(todayFocusWithLive / (sessionStats.averageSessionLength || 1)) : 0
      },

      // Overall statistics
      overview: {
        totalTasks: taskStats.total,
        completedTasks: taskStats.completed,
        pendingTasks: taskStats.pending,
        overdueTasks: taskStats.overdue,
        completionRate: taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0,
        
        totalSessions: sessionStats.totalSessions,
        // Prefer user's live totalFocusTime if present (from heartbeat), else aggregate sessions
        totalFocusTime: Math.max(sessionStats.totalFocusTime, user?.stats?.totalFocusTime ?? 0),
        totalFocusTimeFormatted: formatTime(sessionStats.totalFocusTime),
        averageSessionLength: sessionStats.averageSessionLength,
        thisWeekSessions: sessionStats.thisWeekSessions,
        thisWeekFocusTime: sessionStats.thisWeekFocusTime,
        // Points and level
        points: user?.stats?.points ?? 0,
        level: user?.stats?.level ?? 1,
        
        totalGoals: goalStats.total,
        completedGoals: goalStats.completed,
        goalsInProgress: goalStats.inProgress,
        overdueGoals: goalStats.overdue,
        averageGoalProgress: goalStats.averageProgress,
        
        totalNotes: noteStats.total,
        notesByColor: noteStats.byColor,
        
        currentStreak: sessionStats.currentStreak,
        longestStreak: sessionStats.longestStreak
      },

      // Activity data for heatmap
      activity: activityData,

      // Leaderboard data
      leaderboard: {
        userRank: userRank > 0 ? userRank : null,
        topUsers: leaderboardData.slice(0, 5).map((user, index) => ({
          rank: index + 1,
          name: user.name,
          points: user.stats?.points || 0,
          streak: user.stats?.currentStreak || 0,
          completedTasks: user.stats?.completedTasks || 0,
          isCurrentUser: user._id?.toString() === userId
        }))
      },

      // Quick insights
      insights: {
        mostProductiveDay: activityData.reduce((max, day) => 
          day.sessions > max.sessions ? day : max, 
          { date: '', sessions: 0, totalTime: 0, level: 0 }
        ),
        weeklyAverage: activityData.length > 0 
          ? Math.round(activityData.reduce((sum, day) => sum + day.sessions, 0) / 7)
          : 0,
        streakStatus: sessionStats.currentStreak > 0 
          ? `${sessionStats.currentStreak} day${sessionStats.currentStreak !== 1 ? 's' : ''} strong!`
          : 'Start your streak today!'
      }
    };

    return NextResponse.json(
      { success: true, data: dashboardStats },
      { headers: getSecurityHeaders() }
    );

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}