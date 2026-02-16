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

  const timetextSize = 'sm:text-[40px] text-[15px]';
  const timeSize = 'sm:text-[100px] text-[35px] sm:gap-30 gap-5';

  return (
    <div className={`text-primary rounded-lg mt-20 flex font-mono ${timeSize} text-center font-bold time-size`}>
      <div>
        <div>{formatNumber(timeLeft.days)}</div>
        <div className={`${timetextSize} text-center font-bold tracking-wide text-time-size`}>DAYS</div>
      </div>
      <div>
        <div>{formatNumber(timeLeft.hours)}</div>
        <div className={`${timetextSize} text-center font-bold tracking-wide text-time-size`}>HOURS</div>
      </div>
      <div>
        <div>{formatNumber(timeLeft.minutes)}</div>
        <div className={`${timetextSize} text-center font-bold tracking-wide text-time-size`}>MINUTES</div>
      </div>
      <div>
        <div>{formatNumber(timeLeft.seconds)}</div>
        <div className={`${timetextSize} text-center font-bold tracking-wide text-time-size`}>SECONDS</div>
      </div>
    </div>
  );
};

export default Timer;
