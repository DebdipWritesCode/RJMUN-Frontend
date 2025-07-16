import { useEffect, useState } from 'react';

const Timer = () => {
  // Get current IST time
  const getISTDateNow = () => {
    const nowUTC = new Date();
    const offsetIST = 5.5 * 60; // 5 hours 30 minutes offset
    const istTime = new Date(nowUTC.getTime() + offsetIST * 60 * 1000);
    return istTime;
  };

  // Target time: 12 Sep 2025, 00:00 IST => in UTC: 2025-09-11 18:30:00Z
  const targetDateIST = new Date('2025-09-11T18:30:00Z');

  const calculateTimeLeft = () => {
    const now = getISTDateNow();
    const difference = targetDateIST.getTime() - now.getTime();

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
    <div className={`text-[#1c2d27] rounded-lg mt-20 flex font-mono ${timeSize} text-center font-bold`}>
      <div>
        <div>{formatNumber(timeLeft.days)}</div>
        <div className={`${timetextSize} text-center font-bold tracking-wide`}>DAYS</div>
      </div>
      <div>
        <div>{formatNumber(timeLeft.hours)}</div>
        <div className={`${timetextSize} text-center font-bold tracking-wide`}>HOURS</div>
      </div>
      <div>
        <div>{formatNumber(timeLeft.minutes)}</div>
        <div className={`${timetextSize} text-center font-bold tracking-wide`}>MINUTES</div>
      </div>
      <div>
        <div>{formatNumber(timeLeft.seconds)}</div>
        <div className={`${timetextSize} text-center font-bold tracking-wide`}>SECONDS</div>
      </div>
    </div>
  );
};

export default Timer;
