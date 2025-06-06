import React from "react";
import Image from "next/image";
import teamData from "../lib/teamData";
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

interface TeamMemberProps {
  name: string;
  role: string | string[];
  image: string;
  linkedin?: string;
  github?: string;
  social?: {
    platform: string;
    link: string;
  };
}

const Team: React.FC = () => {
  // Define role order
  const roleOrder = [
    "FRONTEND DEVELOPER",
    "BACKEND DEVELOPER",
    "APP DEVELOPER",
    "UI/UX DESIGNER",
    "VIDEO EDITING",
    "PHOTOSHOP"
  ];

  // Modified grouping logic to handle multiple roles
  const groupedMembers = teamData.reduce((acc, member) => {
    const roles = Array.isArray(member.role) ? member.role : [member.role];
    roles.forEach(role => {
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push({...member, role}); // Add member to each role group
    });
    return acc;
  }, {} as Record<string, typeof teamData>);

  return (
    <section 
      className="min-h-screen py-20 relative bg-black" 
      data-scroll-section
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        <a 
          href="https://cit-celestius.vercel.app/"
          target="_blank" 
          rel="noopener noreferrer"
          className="block text-yellow-400 text-3xl font-semibold text-center mb-16 hover:text-yellow-300 transition-colors"
        >
          {/* Proudly Developed by Celestius */}
        </a>

        {/* Render sections in specified order */}
        {roleOrder.map((role) => {
          if (!groupedMembers[role]) return null;
          return (
            <div key={role} className="mb-16">
              <h3 className="text-2xl font-medium text-white mb-8 border-b border-cyan-400/30 pb-2">
                {role}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {groupedMembers[role].map((member, index) => (
                  <TeamMember key={index} {...member} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const TeamMember: React.FC<TeamMemberProps> = (props) => {
  // Convert role to string for display
  const displayRole = Array.isArray(props.role) ? props.role.join(" & ") : props.role;

  return (
    <div className="relative group">
      {/* Circular Image container with hover effects */}
      <div className="aspect-square relative rounded-full overflow-hidden 
          transform transition-all duration-300 
          group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
        {props.image ? (
          <Image
            src={props.image}
            alt={props.name}
            fill
            className="object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
            style={{ objectPosition: 'center 20%' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800 rounded-full flex items-center justify-center text-4xl text-cyan-400">
            {props.name.split(' ').map(n => n[0]).join('')}
          </div>
        )}
      </div>

      {/* Name and Role - Always visible */}
      <div className="text-center mt-4 transform transition-all duration-300 group-hover:translate-y-1">
        <h3 className="text-xl font-medium text-white group-hover:text-cyan-400 transition-colors">{props.name}</h3>
        <p className="text-sm text-cyan-400 mt-1">{displayRole}</p>
        
        {/* Social Links */}
        <div className="flex justify-center space-x-4 mt-3 opacity-70 group-hover:opacity-100 transition-opacity">
          {props.linkedin && (
            <a 
              href={props.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-cyan-400 transition-colors"
            >
              <FaLinkedin size={20} />
            </a>
          )}
          {props.github && (
            <a 
              href={props.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-cyan-400 transition-colors"
            >
              <FaGithub size={20} />
            </a>
          )}
          {props.social && (
            <a 
              href={props.social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-cyan-400 transition-colors"
            >
              {props.social.platform === 'instagram' && <FaInstagram size={20} />}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;