import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A stacked card component that shows different experiences
 * Front shows one experience and back is blurred until clicked
 * When back is clicked, it replaces the front with a new random experience
 */
const ExperienceCard = ({ items, title, language, getLocalizedContent }) => {
  const [frontIndex, setFrontIndex] = useState(0);
  const [backIndex, setBackIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Ensure we have at least two different items to show
  useEffect(() => {
    if (items && items.length > 0) {
      const randomFront = Math.floor(Math.random() * items.length);
      setFrontIndex(randomFront);
      
      if (items.length > 1) {
        let randomBack;
        do {
          randomBack = Math.floor(Math.random() * items.length);
        } while (randomBack === randomFront);
        setBackIndex(randomBack);
      }
    }
  }, [items]);
  
  // Handle click on back card
  const handleBackCardClick = () => {
    if (items.length <= 1 || isAnimating) return;
    
    setIsAnimating(true);
    
    // Update front index immediately
    setFrontIndex(backIndex);
    
    // For exactly 2 items, just swap front and back
    if (items.length === 2) {
      setBackIndex(frontIndex);
    } else {
      // Choose a new back item that's different from the current front and back
      let newBackIndex;
      do {
        newBackIndex = Math.floor(Math.random() * items.length);
      } while (newBackIndex === backIndex || newBackIndex === frontIndex);
      
      setBackIndex(newBackIndex);
    }
    
    // Reset animation state after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };
  
  if (!items || items.length === 0) return null;

  // If we only have one item, just show it without the stacked cards
  if (items.length === 1) {
    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <motion.div 
          className="card bg-base-100 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderCardContent(items[0])}
        </motion.div>
      </div>
    );
  }

  // Render different content based on item type
  function renderCardContent(item) {
    // Check if it's a professional experience item
    if (item.title && item.company) {
      return (
        <div className="card-body">
          <h4 className="card-title">{getLocalizedContent(item.title)}</h4>
          <div className="flex flex-col md:flex-row md:justify-between">
            <p className="text-lg">{item.company}</p>
            <p className="text-sm opacity-70">
              {item.from && (
                <>
                  {new Date(item.from).toLocaleDateString(language === 'en' ? 'en-US' : 'it-IT', { 
                    year: 'numeric', 
                    month: 'short'
                  })} - {item.current ? (language === 'en' ? 'Present' : 'Presente') : new Date(item.to).toLocaleDateString(language === 'en' ? 'en-US' : 'it-IT', { 
                    year: 'numeric', 
                    month: 'short'
                  })}
                </>
              )}
            </p>
          </div>
          <p className="text-sm opacity-70 mb-2">{item.location}</p>
          
          <p style={{ whiteSpace: 'pre-wrap' }}>{getLocalizedContent(item.description)}</p>
          
          {/* Responsibilities */}
          {item.responsibilities && item.responsibilities[language] && item.responsibilities[language].length > 0 && (
            <div className="mt-2">
              <p className="font-bold">{language === 'en' ? 'Responsibilities:' : 'Responsabilità:'}</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {item.responsibilities[language].map((responsibility, idx) => (
                  <li key={idx} style={{ whiteSpace: 'pre-wrap' }}>{responsibility}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Skills used */}
          {item.skills && item.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.skills.map((skill, idx) => (
                <span key={idx} className="badge badge-sm">{skill}</span>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    // Check if it's a project experience item
    else if (item.name && item.description) {
      return (
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between">
            <h4 className="card-title text-xl">{item.name}</h4>
            <div className="badge badge-neutral my-1 md:my-0">{item.year}</div>
          </div>
          
          {item.role && (
            <p className="text-lg opacity-80">{item.role}</p>
          )}
          
          <p className="my-2" style={{ whiteSpace: 'pre-wrap' }}>{getLocalizedContent(item.description)}</p>
          
          {/* Project bullets/key points */}
          {item.bullets && item.bullets[language] && item.bullets[language].length > 0 && (
            <ul className="list-disc list-inside mt-2 space-y-1">
              {item.bullets[language].map((bullet, idx) => (
                <li key={idx} style={{ whiteSpace: 'pre-wrap' }}>{bullet}</li>
              ))}
            </ul>
          )}
          
          {/* Technologies used */}
          {item.technologies && item.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.technologies.map((tech, idx) => (
                <span key={idx} className="badge badge-sm">{tech}</span>
              ))}
            </div>
          )}
          
          {/* Project link if available */}
          {item.link && (
            <div className="card-actions justify-end mt-2">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-sm btn-primary"
              >
                {language === 'en' ? 'View Project' : 'Vedi Progetto'}
              </a>
            </div>
          )}
        </div>
      );
    }
    
    // Education item
    else if (item.institution && item.degree) {
      return (
        <div className="card-body">
          <h4 className="text-xl font-bold">{item.institution}</h4>
          <p className="text-sm opacity-70">{getLocalizedContent(item.degree)}</p>
          {item.location && <p className="text-sm opacity-70">{item.location}</p>}
          {item.from && item.to && (
            <p className="text-sm opacity-70">
              {new Date(item.from).getFullYear()} - {item.current ? (language === 'en' ? 'Present' : 'Presente') : new Date(item.to).getFullYear()}
            </p>
          )}
          {item.description && <p className="mt-1" style={{ whiteSpace: 'pre-wrap' }}>{getLocalizedContent(item.description)}</p>}
        </div>
      );
    }
    
    // Default case
    return (
      <div className="card-body">
        <p>Content unavailable</p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <div className="relative h-[400px] w-full">
        {/* Stacked Card Container */}
        <div className="relative w-full h-full">
          {/* Front Card */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={`front-${frontIndex}`}
              className="card bg-base-100 shadow-xl absolute left-0 top-0 w-full h-full z-20"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ 
                duration: 0.4,
                ease: "easeInOut"
              }}
            >
              {renderCardContent(items[frontIndex])}
            </motion.div>
          </AnimatePresence>
          
          {/* Back Card (Simplified to improve performance) */}
          <motion.div 
            className="card bg-base-100 shadow-xl absolute left-2 top-2 w-full h-full z-10 cursor-pointer"
            animate={{ 
              scale: isAnimating ? 1.02 : 1,
              rotate: isAnimating ? 0.5 : 0,
              opacity: 0.4
            }}
            style={{ 
              filter: 'blur(2px)',
              transition: 'all 0.3s ease' 
            }}
            whileHover={{ 
              scale: 1.01, 
              filter: 'blur(1px)',
              opacity: 0.6,
              boxShadow: '0 15px 30px -12px rgba(0, 0, 0, 0.2)'
            }}
            onClick={handleBackCardClick}
          >
            {/* Simplified back card content (no heavy rendering) */}
            <div className="card-body">
              <h4 className="card-title opacity-50">
                {items[backIndex].title ? 
                  getLocalizedContent(items[backIndex].title) : 
                  (items[backIndex].name || items[backIndex].institution || '')}
              </h4>
            </div>
            
            {/* Click to Show Overlay - Simplified */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-base-200 bg-opacity-70 px-3 py-1 rounded-lg shadow-sm z-30">
                <p className="text-sm font-medium">
                  {language === 'en' ? 'Next' : 'Prossimo'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard; 