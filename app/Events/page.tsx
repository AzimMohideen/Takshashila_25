"use client";

import { useEffect, useState } from "react";
import "locomotive-scroll/dist/locomotive-scroll.css";

import InteractiveCursor from "@/components/interactiveCursor";
import Footer from "@/components/footer";
import NavBar from "@/components/navBar";
import Eventsdisc from "@/components/event_selector";
import MobileEventSelector from "@/components/MobileEventSelector";

interface CustomEvent {
  id: number;
  title: string;
  category: "Technical" | "Non-Technical" | "Workshops" | "All";
  date: string;
  image: string;
  description: string;
  registrationLink: string;
  rawDescription?: string;
}

// Keep just one definition of eventlist
const eventlist: CustomEvent[] = [
  {
    id: 1,
    title: "Binary Symphony (Duo Code)",
    category: "Technical" as const,
    date: "February 26,2025",
    image: "/tech/BINARYSYMPHONY.png",
    description: `Coding duos! Two participants are paired and are given a problem to solve.
    The duo should take turns to code the solution. But the catch is, they can't be together at the
    same time. As one person codes, the other person is isolated. Swaps occur at regular
    intervals and the first duo to solve the problem wins.`,
    registrationLink: "#"
  },
  {
    id: 2,
    title: "Brand Marketing",
    category: "Technical" as const,
    date: "February 26,2025",
    image: "/tech/BRANDMARKET.png",
    description: `Business Marketing is an event similar to Shark Tank . Topics or Products will be given on the
    spot and students should present the business talk on the given topic like providing quotations
    and handling the business of the product given topics`,
    registrationLink: "#"
  },
  {
    id: 3,
    title: "Reverse Engineering Challenge",
    category: "Technical" as const,
    date: "February 27,2025",
    image: "/nontech/reverse.jpeg",
    description: `Reverse Engineering Challenge is a thrilling tech event where participants analyze software,
hardware, or encrypted files to decode and understand their functionality. The challenge involves
breaking down systems, uncovering hidden logic, and ethically modifying or recreating them. It
tests problem-solving, analytical thinking, and cybersecurity skills in a controlled environment.
Are you ready to unlock the secrets within the code?`,
    registrationLink: "#"
  },
  {
    id: 4,
    title: "Radio Wheels (RC Racing)",
    category: "Technical" as const,
    date: "February 28,2025",
    image: "/tech/RADIOWHEELS.jpg",
    description: `Competition is what makes us work harder. Crash tests, pit stops and obstacle courses. Race to
the finish line while revving your engines. Creativity and strategy packs a punch in this RC race!`,
    registrationLink: "#"
  },
  {
    id: 5,
    title: "Paper Presentation",
    category: "Technical" as const,
    date: "February 27,2025",
    image: "/tech/PAPERPRESENTATION.jpg",
    description: `Paper presentation is a two-member competition where each team is required to provide a
written representation of your idea in English, about a given theme and present it with a
presentation (PowerPoint) in front of the judges.`,
    registrationLink: "#"
  },
  {
    id: 7,
    title: "Trial Tracks (Line Follower)",
    category: "Technical" as const,
    date: "February 26,2025",
    image: "/tech/TRIAL TRACKS.png",
    description: `Where precision meets speed, steer your way to the end-line. Stay on track and you'll stay in the
    game. Wander off track and you'll have to walk out. Gather your courage and components! Are
    you up for this rip-roaring race where only the fast and furious finishes first?`,
    registrationLink: "#"
  },
  {
    id: 8,
    title: "Tech Quest",
    category: "Technical" as const,
    date: "February 27,2025",
    image: "/tech/TECHQUIZ.jpg",
    description: `Science and Technology revolutionize our lives, but memory, tradition and myth frame
    our response. It's a perfect combination of smart and fun. You win or you learn- either
    way it's win-win.`,
    registrationLink: "#"
  },
  {
    id: 9,
    title: "H2O Rocketry",
    category: "Technical" as const,
    date: "February 26,2025",
    image: "/tech/H2OROCKETRY.png",
    description: `It all looked so easy when you did it with paper-where valves never froze, gyros never
drifted and rocked motors did not blow up in your face. Build your own rocket and bring
it on the floor that blast the sky`,
    registrationLink: "#"
  },
  {
    id: 10,
    title: "Dark Web Treasure Hunt",
    category: "Technical" as const,
    date: "February 28,2025",
    image: "/tech/DARKWEBTH.jpg",
    description: `Dark Web Treasure Hunt is a cybersecurity, ethical hacking, and OSINT challenge where
participants become cyber-detectives. They decode hidden messages, trace digital footprints, and
break encryptions to uncover clues. The event simulates the thrill of navigating the "Dark Web"
(without actual access) to solve mysteries. The ultimate goal is to reach the final treasure using
analytical thinking and cyber skills. Are you ready to crack the code?`,
    registrationLink: "#"
  },
  {
    id: 12,
    title: "Designers Onboard",
    category: "Technical" as const,
    date: "February 28,2025",
    image: "/tech/BRANDMARKET.png",
    description: `A live art challenge where creativity meets speed! Get a surprise theme, sketch directly on the board, and showcase your artistic skills under time pressure. No pre-made designs—just pure imagination!`,
    registrationLink: "#"
  },
  {
    id: 13,
    title: "Solo Dance - Dance Till Dawn",
    category: "Non-Technical" as const,
    date: "February 26,2025",
    image: "/nontech/solodance (2).png",
    description: `Do you have what it takes to put on a one-man show? On the dance floor, you are in control of
the rhythm. Set yourself loose and let the music move you. Swing and sway to steal everyone's
hearts!.`,
    registrationLink: "#"
  },
  {
    id: 14,
    title: "IPL Auction",
    category: "Non-Technical" as const,
    date: "February 26,2025",
    image: "/nontech/IPLAUCTION.png",
    description: `What would you do if we said you could auction your way to assemble your dream team? Craft
the most capable cricket team that is a sure sixer squad. Bid, build and dominate the race to boast
a bombarding bonanza!`,
    registrationLink: "#"
  },
  {
    id: 15,
    title: "Behind the Yellow Tapes",
    category: "Non-Technical" as const,
    date: "February 26,2025",
    image: "/nontech/BEHINDTHEYT.png",
    description: `Do you have what it takes to solve the case and bring justice to the departed? Test your wits to
see if your detective skills are as good as Rust Cohle's. Dive into the case files and piece together
the clues to uncover the killer. Are you up for the challenge?`,
    registrationLink: "#"
  },
  {
    id: 16,
    title: "Cypher",
    category: "Non-Technical" as const,
    date: "February 26,2025",
    image: "/nontech/CYPHER2.png",
    description: `Calling out all high-octane hip-hop dancers! Once you step in, there's no going back. Diss your
opponent, not with your words but with your dance. Steal the spotlight with your swings and rap
steps.`,
    registrationLink: "#"
  },
  {
    id: 17,
    title: "Fun Zone",
    category: "Non-Technical" as const,
    date: "February 26,2025",
    image: "/nontech/FUNZONE.png",
    description: `Buckle up for an exhilarating escapade at our much-anticipated FunZone event – an
extraordinary carnival of boundless joy, unabated excitement, and a relentless onslaught of
non-stop entertainment! This is not just another run-of-the-mill gathering; it's a flamboyant
celebration meticulously crafted to awaken the dormant inner child in every attendee.`,
    registrationLink: "#"
  },
  {
    id: 18,
    title: "Graphite-ty",
    category: "Non-Technical" as const,
    date: "February 26,2025",
    image: "/nontech/Graphitely.jpeg",
    description: `Where every stroke tells a story, unlock the creativity within and unleash your vision. Sketch
your way to glory 'cause the canvas is calling for a creative masterpiece`,
    registrationLink: "#"
  },
  {
    id: 19,
    title: "Load the Lyrics",
    category: "Non-Technical" as const,
    date: "February 26,2025",
    image: "/nontech/LOADTHELYRICS.jpg",
    description: `Watch as the lyrics vanish whilst you warble. Fill in the missing tunes and fix the broken beat.
Will you be able to load the lyrics and launch it forward? Test how rusty your rhythm is, with
Load the Lyrics!`,
    registrationLink: "#"
  },
  {
    id: 20,
    title: "Dual Dance - Dynamic Duo",
    category: "Non-Technical" as const,
    date: "February 26,2025",
    image: "/nontech/DUODANCE.jpg",
    description: `Step up, show off, and electrify the stage with double the moves, double the grace and
double the excitement.`,
    registrationLink: "#"
  },
  {
    id: 21,
    title: "Film Fanatics",
    category: "Non-Technical" as const,
    date: "February 26,2025",
    image: "/nontech/FILMFANATICS.jpg",
    description: `Show off your unique ideas and perspectives through the power of movies. Craft a captivating
short film that will enthrall the audience and leave them in awe of your creative artistry`,
    registrationLink: "#"
  },
  {
    id: 22,
    title: "Solo Singing - One Voice Magic",
    category: "Non-Technical" as const,
    date: "February 27,2025",
    image: "/nontech/solo singing.jpg",
    description: `Music is felt rather than heard. With your beguiling voice, you can touch people's hearts and
enlighten their souls. After all, music is much more than just a tune.`,
    registrationLink: "#"
  },
  {
    id: 23,
    title: "Group Singing - Acapella",
    category: "Non-Technical" as const,
    date: "February 27,2025",
    image: "/nontech/group singing.jpg",
    description: `Music is a part of our everyday lives. From the hammering of our hearts to the shrieking of the
cars, it's within us and around us. Amidst the many catastrophic sounds, will your group's
crooning be crowned the best?
Theme: open theme`,
    registrationLink: "#"
  },
  {
    id: 24,
    title: "TK TV",
    category: "Non-Technical" as const,
    date: "February 27,2025",
    image: "/nontech/TK TV.jpg",
    description: `Do you have a dream of appearing on TV? Ever wished you could be the star of your own
programme? Are your acting and marketing abilities up to par? You have a platform to fulfill
your fantasies and steal the show, thanks to TK TV!`,
    registrationLink: "#"
  },
  {
    id: 25,
    title: "On-Air - RJ Hunt",
    category: "Non-Technical" as const,
    date: "February 27,2025",
    image: "/nontech/ONAIR.jpg",
    description: `Radio affects most intimately, person to person, offering a world of unspoken communication
between the writer- speaker and listener.
Step into the spotlight, grab the microphone, take a moment, and be a part of the legacy.`,
    registrationLink: "#"
  },
  {
    id: 26,
    title: "Reel Making - Real to Reel",
    category: "Non-Technical" as const,
    date: "February 27,2025",
    image: "/nontech/Reel to Real.png",
    description: `Videograph your views on our college and capture clips to project your perspective. Summarize
the fervor and magnificence that are rife in our campus!`,
    registrationLink: "#"
  },
  {
    id: 27,
    title: "Street Music-Jam",
    category: "Non-Technical" as const,
    date: "February 28,2025",
    image: "/nontech/Street music.jpg",
    description: `Videograph your views on our college and capture clips to project your perspective. Summarize
the fervor and magnificence that are rife in our campus!`,
    registrationLink: "#"
  },
  {
    id: 28,
    title: "World whiz",
    category: "Non-Technical" as const,
    date: "February 28,2025",
    image: "/nontech/word whiz.png",
    description: `Videograph your views on our college and capture clips to project your perspective. Summarize
the fervor and magnificence that are rife in our campus!`,
    registrationLink: "#"
  },
  {
    id: 29,
    title: "Stress Interview",
    category: "Non-Technical" as const,
    date: "February 27,2025",
    image: "/nontech/stress interview (1).jpg",
    description: `Just like mentally strong people, we must be able to thrive regardless of any added tension. We
have to put our stress in perspective, replace negative thoughts with positive ones and be proud
of our achievements`,
    registrationLink: "#"
  },
  {
    id: 30,
    title: "Treasure Hunt",
    category: "Non-Technical" as const,
    date: "Feb 26,27,28 2025",
    image: "/nontech/treasure hunt.jpg",
    description:`No thief, however skillful, can rob one of knowledge, and that is why knowledge is the best and
desirable treasure to acquire. Treasure Hunt makes better stories when there's treasure at the end.`,
    registrationLink: "#"
  },
  {
    id: 31,
    title: "Surprise Event",
    category: "Non-Technical" as const,
    date: "February 27,2025",
    image: "/nontech/suprise.png",
    description: `Whether you're an adventure seeker or just looking for a unique and exciting experience, our
surprise event is the perfect destination. With the element of surprise at every turn, our event
promises to be an experience like no other. We can't reveal too much just yet, but rest assured
that you'll be treated to a day of excitement!`,
    registrationLink: "#"
  },
  {
    id: 34,
    title: "Talking Head",
    category: "Non-Technical" as const,
    date: "February 28,2025",
    image: "/nontech/TALKINGHEAD.png",
    description: `<p>Do you like to Roast the Event activities? Do you think you can handle a massive event like Takshashila the happenings of this hustling event?</p>

<h3>REGISTRATION:</h3>
<ul>
  <li>College ID is mandatory</li>
  <li>This event comes under general registration</li>
</ul>

<h3>RULES:</h3>

<h4>• Language & Respect</h4>
<ul>
  <li>Only English is allowed</li>
  <li>No hate speech or personal attacks</li>
  <li>Light-hearted humour only</li>
</ul>

<h4>• Format & Timing</h4>
<ul>
  <li>Contestants get 2-3 minutes per round</li>
  <li>30-second rebuttals allowed</li>
  <li>Turns are decided randomly</li>
</ul>

<h4>• Originality & Uniqueness</h4>
<ul>
  <li>Jokes must be original</li>
  <li>No plagiarism or repeated jokes/topics</li>
  <li>Each round has a unique topic</li>
</ul>

<h4>• Audience & Conduct</h4>
<ul>
  <li>Audience can cheer but not interrupt</li>
  <li>No physical gestures or interruptions from contestants</li>
</ul>

<h4>• Judging & Penalties</h4>
<ul>
  <li>Winners are judged on creativity, humour, and delivery</li>
  <li>Rule violations lead to warnings, deductions, or disqualification</li>
</ul>`,
    registrationLink: "#"
  },
  {
    id: 35,
    title: "Rap Battle - Rap-a-thon",
    category: "Non-Technical" as const,
    date: "February 28,2025",
    image: "/nontech/RAPATHON.png",
    description: `Just get on the mic and spit those rhymes and better go capture this moment and hope it doesn't
pass. Lose yourself in the music, the moment, You own it, you better never let it go. You only get
one shot, do not miss your chance to blow. Keep spilling these raps long till you collapse. Wake
the real slim shady in you.`,
    registrationLink: "#"
  },
  {
    id: 36,
    title: "Battlegrounds Mobile India",
    category: "Non-Technical" as const,
    date: "February 28,2025",
    image: "/nontech/PUBG.png",
    description: `Navigate the battlegrounds of BGMI, where every pixel holds the weight of victory. Adapt,
conquer, and carve your legend in the pulse-pounding chaos of mobile warfare.`,
    registrationLink: "#"
  },
  {
    id: 37,
    title: "Ship Wreck",
    category: "Non-Technical" as const,
    date: "February 28,2025",
    image: "/nontech/LIFEBOAT.png",
    description: `Navigate the battlegrounds of BGMI, where every pixel holds the weight of victory. Adapt,
conquer, and carve your legend in the pulse-pounding chaos of mobile warfare.`,
    registrationLink: "#"
  },
  {
    id: 38,
    title: "Music Quiz",
    category: "Non-Technical" as const,
    date: "February 28,2025",
    image: "/nontech/MUSICQUIZ.jpg",
    description: `Navigate the battlegrounds of BGMI, where every pixel holds the weight of victory. Adapt,
conquer, and carve your legend in the pulse-pounding chaos of mobile warfare.`,
    registrationLink: "#"
  },
  {
    id: 39,
    title: "Anime Guantlet",
    category: "Non-Technical" as const,
    date: "February 28,2025",
    image: "/nontech/ANIMEGAUNLET.png",
    description: `Are you ready to battle it out in the ultimate test of anime knowledge and skills? Anime Gauntlet is the ultimate showdown where anime lovers compete in a series of exciting challenges, ranging from trivia, character identification, and theme-based quizzes `,
    registrationLink: "#"
  },
  {
    id: 40,
    title: "Frame Spot",
    category: "Non-Technical" as const,
    date: "February 26,2025",
    image: "/nontech/FRAMESPOT.jpg",
    description: `<p>Framespot is a visually engaging puzzle game where players decode a series of interconnected images to uncover the name of a movie. Each set of images represents key elements—be it symbols, locations, props, or abstract clues—that, when linked together, reveal the film's title. The game tests players' cinematic knowledge, lateral thinking, and pattern recognition skills, making it both an entertaining and intellectually stimulating experience.</p>

<h3>RULES:</h3>

<h4>• Team Formation</h4>
<ul>
  <li>Participants should register in teams of 3-4 members</li>
  <li>Individual participants will be grouped by the volunteers</li>
</ul>

<h4>• Gameplay</h4>
<ul>
  <li>For each collaged image clues 30-40 second will be provided</li>
  <li>For each right answer 1 point will be awarded</li>
  <li>The first answer locked will be the final answer</li>
</ul>

<h4>• Answer Procedure</h4>
<ul>
  <li>The team that buzzes first has the chance to answer first</li>
  <li>If the answer is wrong, it will go to the team that buzzed the next</li>
  <li>The teams that scores the maximum points in round 1 will be chosen for round 2-the finals</li>
</ul>

<h4>• Fair Play</h4>
<ul>
  <li>Players will not be allowed to seek assistant from internet or any other external sources</li>
  <li>Any form of malpractices or failure of decorum will lead to disqualification of the team</li>
</ul>`,
    registrationLink: "#"
  },
  {
    id: 41,
    title: "Connection Music",
    category: "Non-Technical" as const,
    date: "February 27,2025",
    image: "/nontech/CONNECTIONMUSIC.jpg",
    description: `Navigate the battlegrounds of BGMI, where every pixel holds the weight of victory. Adapt,
conquer, and carve your legend in the pulse-pounding chaos of mobile warfare.`,
    registrationLink: "#"
  },
  {
    id: 42,
    title: "Full Stack Web Development",
    category: "Workshops" as const,
    date: "February 27,2025",
    image: "/workshops/fullstack.jpg",
    description: `A website and a server designed by a single person, is that even possible? Well, if you know
about full-stack development, it is! In this workshop learn how to program a website and also
gain knowledge on creating exclusive databases and servers for the website that you designed.
The workshop will also focus on best practices for software development, such as version
control, testing, and debugging. By the end of the workshop, participants will have a solid
understanding of full-stack development and be able to build their own web applications from
scratch.`,
    registrationLink: "#"
  },
  {
    id: 43,
    title: "AI-ML",
    category: "Workshops" as const,
    date: "February 28,2025",
    image: "/workshops/aiml.jpeg",
    description: `AI/ML Workshop
Explore the basics of AI and machine learning with hands-on projects using Python frameworks such as TensorFlow and Scikit-Learn.`,
    registrationLink: "#"
  },
  {
    id: 44,
    title: "Cybersecurity",
    category: "Workshops" as const,
    date: "February 27,2025",
    image: "/workshops/cyber.jpeg",
    description: "In today's interconnected digital world, the need for robust cybersecurity measures has never been greater. Whether you're an individual seeking to protect your personal information or a business professional responsible for safeguarding sensitive data, understanding cybersecurity fundamentals is paramount. Join us for an engaging and informative workshop designed to equi participants with the knowledge and skills necessary to navigate the cyber landscape securely.",
    registrationLink: "#"
  },
  {
    id: 45,
    title: "Drone Technology",
    category: "Workshops" as const,
    date: "February 28,2025",
    image: "/workshops/drone.jpg",
    description: `Have you ever thought about building and controlling your own miniature aircraft? If so, this
drone technology workshop is perfect for you! You'll learn the basic science behind drones and
design a fully functional drone that you can fly one day. Drones have a wide range of potential
applications, from package delivery to the defense industry. This interactive event allows
participants to engage and gain practical knowledge about drone technology.`,
    registrationLink: "#"
  },
  {
    id: 46,
    title: "Aeromodelling",
    category: "Workshops" as const,
    date: "February 26,2025",
    image: "/workshops/Aeromodelling.jpeg",
    description: "Aeromodelling is an exciting and dynamic field that offers a unique opportunity for students to develop a diverse range of skills across multiple disciplines. Through interactive sessions, this workshop provides a comprehensive understanding of the principles of aerodynamics, electrical engineering, and control systems. Students will learn how to design and build a fully functioning radio-controlled aircraft, gaining valuable experience in problem-solving and critical thinking. It's an exciting and rewarding experience that can inspire the next generation of engineers, designers, and innovators.",
    registrationLink: "#"
  },
  {
    id: 47,
    title: "CITIL - Idea to Impact",
    category: "Workshops" as const,
    date: "February 27,2025",
    image: "/workshops/idea to impact.jpg",
    description: `In this dynamic workshop, we invite you to unlock the doors to innovation, where creative
thinking is not just encouraged but celebrated. Through hands-on activities, interactive sessions,
and real-world case studies, we aim to ignite the spark of ingenuity within you, empowering you
to think outside conventional boundaries and explore the uncharted territories of entrepreneurial
possibility. Join us in this Entrepreneurship Workshop, where the ordinary transforms into the
extraordinary, and where your entrepreneurial journey takes flight. Together, let's unlock the
doors to a future where innovation knows no bounds, creativity is boundless, and business
success is not just a destination but a continuous and exhilarating journey.`,
    registrationLink: "#"
  },
  {
    id: 48,
    title: "World of Open Source with GitHub",
    category: "Workshops" as const,
    date: "February 26,2025",
    image: "/workshops/github.jpg",
    description: `This insightful workshop aims to provide students with practical knowledge of open-source
collaboration, version control using Git and GitHub, and hands-on experience in building
full-stack applications. By fostering a culture of open-source development and introducing
DevOps principles, this workshop will prepare participants for real-world challenges and
industry-relevant practices.`,
    registrationLink: "#"
  },
  {
    id: 49,
    title: "Networking with Linux",
    category: "Workshops" as const,
    date: "February 28,2025",
    image: "/workshops/linux.jpeg",
    description: `This Workshop offers participants a thorough understanding of Linux operating systems, basic
command-line usage, networking essentials encompassing TCP/IP, subnetting, and routing, as
well as practical networking commands. Participants engage with live booting, virtualization
using VMware, and gain exposure to Wireshark for network traffic analysis. The workshop also
introduces Nmap for network scanning. Overall, attendees emerge equipped with fundamental
knowledge of Linux, networking concepts, and essential cybersecurity tools, priming them for
further exploration in these domains.`,
    registrationLink: "#"
  },
  {
    id: 50,
    title: "IoT and Embedded Systems",
    category: "Workshops" as const,
    date: "February 26,2025",
    image: "/workshops/iot.jpg",
    description: "In this workshop, you will learn about designing and applying IoT systems. You will work on real-world projects and gain hands-on experience in industries like healthcare, agriculture, and transportation. By the end of the workshop, you will have gained valuable knowledge and skills that can be applied to your own projects and career development. Join us to explore the world of IoT and its endless possibilities!",
    registrationLink: "#"
  },
  {
    id: 51,
    title: "Music Production",
    category: "Workshops" as const,
    date: "February 28,2025",
    image: "/workshops/music production.jpg",
    description: `Music Production Workshop
Dive into digital music production, mastering DAWs like FL Studio and Ableton Live to create, mix, and enhance your own tracks.`,
    registrationLink: "#"
  }
].map(event => ({
  ...event,
  rawDescription: event.description
})) as CustomEvent[];

export default function Events() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.replace('#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <div 
      className="cursor-none min-h-screen"
      style={{
        background: 'linear-gradient(to bottom, #004225 0%, #013220 50%, #002616 100%)',
      }}
    >
      {!isMobile && <InteractiveCursor />}
      
      <div className="relative z-10">
        <NavBar />
        <div className={`relative ${isMobile ? 'pt-16' : ''}`}>
          {isMobile ? (
            <MobileEventSelector events={eventlist} />
          ) : (
            <Eventsdisc events={eventlist} />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
