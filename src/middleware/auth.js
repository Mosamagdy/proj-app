import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  // لو مفيش توكن، يتم التوجيه إلى `/login`
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // السماح للمستخدم بمتابعة التصفح إذا كان لديه توكن
  return NextResponse.next();
}

// تحديد الصفحات اللي محتاجة تحقق
export const config = {
  matcher: ['/', '/home', '/dashboard/:path*', '/profile/:path*'],
};