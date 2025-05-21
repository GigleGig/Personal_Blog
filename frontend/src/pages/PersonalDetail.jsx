import React, { useState, useEffect } from 'react'
import GuideBar from './GuideBar'
import { motion } from 'framer-motion'
import { profileService } from '../services/api'
import ExperienceCard from '../components/ExperienceCard'
import ErrorBoundary from '../components/ErrorBoundary'
import '../styles/card.css'

function PersonalDetail() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en'); // Default language

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profileService.getProfile();
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(null);
        setLoading(false);
        setProfile(null);
      }
    };

    fetchProfile();
  }, []);

  // Default profile data if none is found
  const defaultProfile = {
    fullName: 'Xiaofeng Zhang',
    title: { en: 'Software Developer', it: 'Sviluppatore Software' },
    tagline: { en: 'REPEAT THEN CREATE.', it: 'RIPETI POI CREA.' },
    bio: { 
      en: "I'm a passionate developer focused on building innovative solutions and exploring new technologies. My journey in software development has been driven by curiosity and the desire to create meaningful applications.", 
      it: "Sono uno sviluppatore appassionato, concentrato sulla creazione di soluzioni innovative e sull'esplorazione di nuove tecnologie. Il mio percorso nello sviluppo software è stato guidato dalla curiosità e dal desiderio di creare applicazioni significative."
    },
    skills: {
      programmingLanguages: ['C/C++', 'Python', 'Java', 'JavaScript'],
      frameworks: ['MVC', 'Spring', 'React', 'Vue'],
      databases: ['MySQL', 'SQL', 'SQLite', 'MongoDB'],
      tools: ['Git', 'Docker', 'TensorFlow'],
      webDevelopment: ['HTML', 'CSS', 'JavaScript'],
      aiMl: ['Neural Networks', 'Machine Learning Algorithms']
    },
    languages: [
      { language: 'Mandarin', proficiency: 'Native' },
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Italian', proficiency: 'Intermediate' }
    ],
    education: [
      {
        institution: 'University of Bologna (UNIBO)',
        degree: { en: 'Computer Science', it: 'Informatica' },
        location: 'Bologna, Italy',
        from: new Date('2022-09-01'),
        to: new Date('2024-06-30'),
        description: { 
          en: 'Focus on AI, machine learning, and software engineering',
          it: 'Focus su IA, machine learning e ingegneria del software' 
        }
      },
      {
        institution: 'Beijing University of Technology',
        degree: { en: 'Computer Science (Bachelor)', it: 'Informatica (Laurea Triennale)' },
        location: 'Beijing, China',
        from: new Date('2017-09-01'),
        to: new Date('2021-06-30'),
        description: { 
          en: 'Studied fundamentals of computer science, data structures, and algorithms',
          it: 'Studio dei fondamenti dell\'informatica, strutture dati e algoritmi' 
        }
      },
      {
        institution: 'Hangzhou Technical Institute',
        degree: { en: 'Web Development Certificate', it: 'Certificato di Sviluppo Web' },
        location: 'Hangzhou, China',
        from: new Date('2016-03-01'),
        to: new Date('2016-08-30'),
        description: { 
          en: 'Intensive training in web technologies and front-end development',
          it: 'Formazione intensiva in tecnologie web e sviluppo front-end' 
        }
      }
    ],
    projectExperience: [
      {
        name: 'Product Recognition & Classification',
        description: { 
          en: 'Machine learning model for food product classification.',
          it: 'Modello di apprendimento automatico per la classificazione dei prodotti alimentari.' 
        },
        technologies: ['TensorFlow', 'Keras', 'OpenCV'],
        year: '2024',
        bullets: {
          en: [
            'Led the development of a machine learning model for food product classification',
            'Utilized TensorFlow, Keras, and OpenCV for training CNN-based models',
            'Achieved high classification accuracy through data augmentation and feature engineering'
          ],
          it: [
            'Guidato lo sviluppo di un modello di machine learning per la classificazione dei prodotti alimentari',
            'Utilizzato TensorFlow, Keras e OpenCV per addestrare modelli basati su CNN',
            'Raggiunto alta precisione di classificazione grazie all\'aumento dei dati e all\'ingegneria delle caratteristiche'
          ]
        }
      },
      {
        name: 'Personal Blog Platform',
        description: { 
          en: 'Full-stack web application for personal blogging with modern UI.',
          it: 'Applicazione web full-stack per il blogging personale con interfaccia utente moderna.' 
        },
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        year: '2023',
        bullets: {
          en: [
            'Designed and implemented a responsive blog platform with React and TailwindCSS',
            'Created RESTful API endpoints with Node.js and Express',
            'Implemented authentication, content management, and media upload features'
          ],
          it: [
            'Progettato e implementato una piattaforma di blog responsive con React e TailwindCSS',
            'Creato endpoint API RESTful con Node.js ed Express',
            'Implementato funzionalità di autenticazione, gestione dei contenuti e caricamento di media'
          ]
        }
      },
      {
        name: 'Smart Home IoT System',
        description: { 
          en: 'IoT system for home automation with mobile app control.',
          it: 'Sistema IoT per la domotica con controllo tramite app mobile.' 
        },
        technologies: ['Arduino', 'Raspberry Pi', 'MQTT', 'React Native'],
        year: '2022',
        bullets: {
          en: [
            'Designed an IoT system for controlling home devices using Arduino and Raspberry Pi',
            'Implemented MQTT protocol for device communication',
            'Developed a React Native mobile app for remote control and monitoring'
          ],
          it: [
            'Progettato un sistema IoT per controllare dispositivi domestici utilizzando Arduino e Raspberry Pi',
            'Implementato il protocollo MQTT per la comunicazione tra dispositivi',
            'Sviluppato un\'app mobile React Native per il controllo e monitoraggio remoto'
          ]
        }
      }
    ],
    experience: [
      {
        title: { en: 'Game Developer (Internship)', it: 'Sviluppatore di Giochi (Stage)' },
        company: 'Beijing Fangshan Game Company',
        location: 'China',
        from: new Date('2019-01-01'),
        to: new Date('2020-01-01'),
        description: { 
          en: 'Developed and optimized gameplay mechanics using Cocos2d-X and C++.',
          it: 'Sviluppato e ottimizzato meccaniche di gioco utilizzando Cocos2d-X e C++.' 
        },
        responsibilities: {
          en: [
            'Developed and optimized gameplay mechanics using Cocos2d-X and C++',
            'Collaborated with a team to design new game features and debug existing ones',
            'Conducted user testing and provided feedback for improving player experience'
          ],
          it: [
            'Sviluppato e ottimizzato meccaniche di gioco utilizzando Cocos2d-X e C++',
            'Collaborato con un team per progettare nuove funzionalità e risolvere bug esistenti',
            'Condotto test utente e fornito feedback per migliorare l\'esperienza di gioco'
          ]
        }
      },
      {
        title: { en: 'Web Developer (Part-time)', it: 'Sviluppatore Web (Part-time)' },
        company: 'Shanghai Digital Solutions',
        location: 'China',
        from: new Date('2020-06-01'),
        to: new Date('2021-05-01'),
        description: { 
          en: 'Developed responsive websites and web applications for various clients.',
          it: 'Sviluppato siti web responsivi e applicazioni web per vari clienti.' 
        },
        responsibilities: {
          en: [
            'Built responsive websites using HTML, CSS, JavaScript, and Vue.js',
            'Implemented backend functionality with Node.js and Express',
            'Integrated payment gateways and third-party APIs'
          ],
          it: [
            'Creato siti web responsivi utilizzando HTML, CSS, JavaScript e Vue.js',
            'Implementato funzionalità backend con Node.js ed Express',
            'Integrato gateway di pagamento e API di terze parti'
          ]
        },
        skills: ['HTML', 'CSS', 'JavaScript', 'Vue.js', 'Node.js']
      },
      {
        title: { en: 'Research Assistant', it: 'Assistente di Ricerca' },
        company: 'University of Bologna',
        location: 'Italy',
        from: new Date('2022-10-01'),
        to: new Date('2023-06-01'),
        description: { 
          en: 'Conducted research on machine learning applications in natural language processing.',
          it: 'Condotto ricerche sulle applicazioni di machine learning nell\'elaborazione del linguaggio naturale.' 
        },
        responsibilities: {
          en: [
            'Implemented and tested various NLP models for sentiment analysis',
            'Conducted experiments to improve model accuracy and performance',
            'Published a research paper on the findings in a conference proceeding'
          ],
          it: [
            'Implementato e testato vari modelli NLP per l\'analisi del sentiment',
            'Condotto esperimenti per migliorare l\'accuratezza e le prestazioni del modello',
            'Pubblicato un articolo di ricerca sui risultati in un atto di conferenza'
          ]
        },
        skills: ['Python', 'PyTorch', 'NLTK', 'Scikit-learn', 'Research']
      }
    ],
    social: {
      github: 'https://github.com/GigleGig',
      twitter: 'https://x.com/hexaburden',
      linkedin: 'https://www.linkedin.com/in/xiaofeng-zhang-61a16b261/',
      email: 'zxf19970424@gmail.com'
    }
  };

  // Use fetched profile or default
  const displayProfile = profile || defaultProfile;

  // Helper function to get content in current language with fallback
  const getLocalizedContent = (content) => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    return content[language] || content['en'] || '';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'it' : 'en');
  };

  return (
    <div className="min-h-screen bg-base-100">
      <GuideBar />
      <motion.div 
        className="container mx-auto p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button 
            className="btn btn-outline btn-sm"
            onClick={toggleLanguage}
          >
            {language === 'en' ? '🇮🇹 Italiano' : '🇬🇧 English'}
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error max-w-lg mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Profile Card */}
            <motion.div 
              className="card bg-base-200 shadow-xl mx-auto max-w-4xl"
              variants={itemVariants}
            >
              <div className="card-body">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <motion.div 
                    className="avatar"
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    <div className="w-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={displayProfile.avatar || "https://avatars.githubusercontent.com/u/GigleGig"} alt={displayProfile.fullName} />
                    </div>
                  </motion.div>
                  <div>
                    <motion.h1 
                      className="text-4xl font-bold mb-2"
                      variants={itemVariants}
                    >
                      {displayProfile.fullName}
                    </motion.h1>
                    <motion.h2 
                      className="text-2xl mb-4"
                      variants={itemVariants}
                    >
                      @GigleGig
                    </motion.h2>
                    <motion.p 
                      className="mb-2"
                      variants={itemVariants}
                    >
                      {getLocalizedContent(displayProfile.tagline)}
                    </motion.p>
                    <motion.div 
                      className="flex gap-2 mb-4"
                      variants={itemVariants}
                    >
                      <div className="badge badge-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M22 9L12 5 2 9l10 4 10-4v6"></path>
                          <path d="M6 10.6V16c0 1 1.5 2 3.5 2s3.5-1 3.5-2v-5.4"></path>
                        </svg>
                        UNIBO
                      </div>
                      <div className="badge badge-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        BOLOGNA
                      </div>
                    </motion.div>
                    <motion.div 
                      className="flex flex-wrap gap-2"
                      variants={itemVariants}
                    >
                      <a href={displayProfile.social?.github || "https://github.com/GigleGig"} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        GitHub
                      </a>
                      <a href={displayProfile.social?.twitter || "https://x.com/hexaburden"} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                        Twitter
                      </a>
                      <a href={displayProfile.social?.linkedin || "https://www.linkedin.com/in/xiaofeng-zhang-61a16b261/"} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                        LinkedIn
                      </a>
                      <a href={`mailto:${displayProfile.social?.email || "zxf19970424@gmail.com"}`} className="btn btn-outline btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Email
                      </a>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="mt-8 card bg-base-200 shadow-xl mx-auto max-w-4xl"
              variants={itemVariants}
            >
              <div className="card-body">
                <motion.h2 
                  className="text-3xl font-bold mb-4"
                  variants={itemVariants}
                >
                  {language === 'en' ? 'About Me' : 'Chi Sono'}
                </motion.h2>
                <div className="divider"></div>
                <motion.p 
                  className="mb-4"
                  variants={itemVariants}
                >
                  {getLocalizedContent(displayProfile.bio)}
                </motion.p>
                
                {/* Languages Section */}
                <motion.h3 
                  className="text-2xl font-bold mt-6 mb-2"
                  variants={itemVariants}
                >
                  {language === 'en' ? 'Languages' : 'Lingue'}
                </motion.h3>
                <motion.div 
                  className="flex flex-wrap gap-2 mb-6"
                  variants={itemVariants}
                >
                  {displayProfile.languages && displayProfile.languages.map((lang, index) => (
                    <div key={index} className="badge badge-lg gap-2">
                      {lang.language}
                      <div className="badge badge-sm">{lang.proficiency}</div>
                    </div>
                  ))}
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold mt-6 mb-2"
                  variants={itemVariants}
                >
                  {language === 'en' ? 'Skills' : 'Competenze'}
                </motion.h3>
                
                {/* Display skills by category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {displayProfile.skills && Object.entries(displayProfile.skills).map(([category, skills]) => {
                    if (skills && skills.length > 0) {
                      // Format category name for display
                      const formatCategory = (cat) => {
                        switch(cat) {
                          case 'programmingLanguages':
                            return language === 'en' ? 'Programming Languages' : 'Linguaggi di Programmazione';
                          case 'frameworks':
                            return language === 'en' ? 'Frameworks' : 'Framework';
                          case 'databases':
                            return language === 'en' ? 'Databases' : 'Database';
                          case 'tools':
                            return language === 'en' ? 'Tools' : 'Strumenti';
                          case 'webDevelopment':
                            return language === 'en' ? 'Web Development' : 'Sviluppo Web';
                          case 'aiMl':
                            return language === 'en' ? 'AI/ML' : 'IA/ML';
                          case 'other':
                            return language === 'en' ? 'Other' : 'Altro';
                          default:
                            return cat;
                        }
                      };
                      
                      return (
                        <motion.div key={category} variants={itemVariants}>
                          <h4 className="font-bold mb-2">{formatCategory(category)}</h4>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill, idx) => (
                              <motion.div
                                key={idx}
                                className="badge badge-outline"
                                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                              >
                                {skill}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    }
                    return null;
                  })}
                </div>
                
                {/* Experience Sections using the flip card component */}
                {displayProfile.projectExperience && displayProfile.projectExperience.length > 0 && (
                  <ErrorBoundary>
                    <ExperienceCard
                      items={displayProfile.projectExperience}
                      title={language === 'en' ? 'Project Experience' : 'Esperienza di Progetto'}
                      language={language}
                      getLocalizedContent={getLocalizedContent}
                    />
                  </ErrorBoundary>
                )}
                
                {displayProfile.education && displayProfile.education.length > 0 && (
                  <ErrorBoundary>
                    <ExperienceCard
                      items={displayProfile.education}
                      title={language === 'en' ? 'Education' : 'Formazione'}
                      language={language}
                      getLocalizedContent={getLocalizedContent}
                    />
                  </ErrorBoundary>
                )}
                
                {displayProfile.experience && displayProfile.experience.length > 0 && (
                  <ErrorBoundary>
                    <ExperienceCard
                      items={displayProfile.experience}
                      title={language === 'en' ? 'Professional Experience' : 'Esperienza Professionale'}
                      language={language}
                      getLocalizedContent={getLocalizedContent}
                    />
                  </ErrorBoundary>
                )}
                
                <motion.h3 
                  className="text-2xl font-bold mt-6 mb-2"
                  variants={itemVariants}
                >
                  {language === 'en' ? 'Interests' : 'Interessi'}
                </motion.h3>
                <motion.p variants={itemVariants}>
                  {language === 'en' 
                    ? "When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and sharing knowledge with the developer community."
                    : "Quando non programmo, mi piace esplorare nuove tecnologie, contribuire a progetti open-source e condividere conoscenze con la comunità di sviluppatori."}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default PersonalDetail