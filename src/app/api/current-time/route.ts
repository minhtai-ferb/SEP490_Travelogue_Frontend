import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const currentTime = new Date();
    
    return NextResponse.json({
      success: true,
      data: {
        currentTime: currentTime.toISOString(),
        localTime: currentTime.toLocaleString('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        timestamp: currentTime.getTime(),
        timezone: 'Asia/Ho_Chi_Minh',
        utc: currentTime.toUTCString(),
        date: {
          year: currentTime.getFullYear(),
          month: currentTime.getMonth() + 1,
          day: currentTime.getDate(),
          hour: currentTime.getHours(),
          minute: currentTime.getMinutes(),
          second: currentTime.getSeconds()
        }
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get current time'
    }, { status: 500 });
  }
}
