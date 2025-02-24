import React, { useEffect, useState, useRef, useCallback } from 'react';
import "../styles/eventRoller.css";

interface SlideItem {
    image: string;
    title: string;
    content: string[];
}

const EventRoller = () => {
    const [active, setActive] = useState<number>(0);
    const slideInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    const items: SlideItem[] = [
        {
            image: '/students.jpeg',
            title: 'Excellence in Education',
            content: [
                'A prominent institution ranking amongst the top colleges in Tamil Nadu.',
                'Partnered with leading companies to offer diverse opportunities in education and recreation.'
            ]
        },
        {
            image: '/industryready.jpeg',
            title: 'Industry Ready',
            content: [
                'Our objective for establishing CIT is to transfer our knowledge to you, so that you can transform into a proper engineer',
                '~Shri Sriram Parthasarathy'
            ]
        },
        {
            image: '/tk1.jpg',
            title: 'Our Vision',
            content: ['The students\' appetite for knowledge makes them thrive to prepare for the ready-to-serve industrial requirements.',
                'Chennai Institute of Technology has been awarded the National Award of Excellence for Best Placements & has been ranked Second in Tamil Nadu.'
            ]
        }
    ];

    const nextSlide = useCallback(() => {
        setActive(prev => (prev + 1) % items.length);
    }, [items.length]);

    const startAutoSlide = useCallback(() => {
        if (slideInterval.current) {
            clearInterval(slideInterval.current);
        }
        slideInterval.current = setInterval(nextSlide, 7000);
    }, [nextSlide]);

    useEffect(() => {
        const setDiameter = () => {
            if (sliderRef.current) {
                const widthSlider = Math.max(sliderRef.current.offsetWidth, window.innerWidth);
                const heightSlider = Math.max(sliderRef.current.offsetHeight, window.innerHeight);
                const diameter = Math.sqrt(Math.pow(widthSlider, 2) + Math.pow(heightSlider, 2));
                document.documentElement.style.setProperty('--diameter', `${diameter}px`);
            }
        };

        setDiameter();
        startAutoSlide();

        window.addEventListener('resize', setDiameter);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                startAutoSlide();
            }
        });
        
        window.addEventListener('focus', startAutoSlide);

        return () => {
            if (slideInterval.current) {
                clearInterval(slideInterval.current);
            }
            window.removeEventListener('resize', setDiameter);
            window.removeEventListener('focus', startAutoSlide);
        };
    }, [startAutoSlide]);

    return (
        <div id="event-roller" className="slider-container" data-scroll-section>
            <header />
            <section className="slider" ref={sliderRef}>
                <div className="list">
                    {items.map((item, index) => (
                        <div 
                            key={index} 
                            className={`item ${index === active ? 'active' : ''}`}
                        >
                            <div 
                                className="image" 
                                style={{ 
                                    '--url': `url('${item.image}')` 
                                } as React.CSSProperties}
                            />
                            <div className="content">
                                <h2>{item.title}</h2>
                                <div className="paragraphs">
                                    {item.content.map((paragraph, pIndex) => (
                                        <p key={pIndex}>{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default EventRoller;
