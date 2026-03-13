import { useEffect, useState } from 'react';

const Timer = () => {
  // Target time in UTC: 2025-09-11 18:30:00Z (12 Sep 2025, 00:00 IST)
  const targetDateUTC = new Date('2026-06-11T18:30:00Z');

  const calculateTimeLeft = () => {
    const nowUTC = new Date();

    const difference = targetDateUTC.getTime() - nowUTC.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const timetextSize = 'sm:text-[40px] text-[12px]';
  const timeSize = 'sm:text-[100px] text-[25px] sm:gap-30 gap-5';

  return (
    <div className={`text-primary rounded-lg mt-20 flex font-mono ${timeSize} text-center font-bold time-size`}>
      <div>
        <div style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #f8d76f 0%, #d4a82a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {formatNumber(timeLeft.days)}
        </div>
        <div className={`${timetextSize} text-center font-bold tracking-wide text-time-size`} style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 600,
          borderBottom: '2px solid #d4a82a',
          paddingBottom: '4px'
        }}>
          DAYS
        </div>
      </div>
      <div>
        <div style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #f8d76f 0%, #d4a82a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {formatNumber(timeLeft.hours)}
        </div>
        <div className={`${timetextSize} text-center font-bold tracking-wide text-time-size`} style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 600,
          borderBottom: '2px solid #d4a82a',
          paddingBottom: '4px'
        }}>
          HOURS
        </div>
      </div>
      <div>
        <div style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #f8d76f 0%, #d4a82a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {formatNumber(timeLeft.minutes)}
        </div>
        <div className={`${timetextSize} text-center font-bold tracking-wide text-time-size`} style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 600,
          borderBottom: '2px solid #d4a82a',
          paddingBottom: '4px'
        }}>
          MINUTES
        </div>
      </div>
      <div>
        <div style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #f8d76f 0%, #d4a82a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {formatNumber(timeLeft.seconds)}
        </div>
        <div className={`${timetextSize} text-center font-bold tracking-wide text-time-size`} style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 600,
          borderBottom: '2px solid #d4a82a',
          paddingBottom: '4px'
        }}>
          SECONDS
        </div>
      </div>
    </div>
  );
};

export default Timer;
