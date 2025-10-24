import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Users, User, Home } from 'lucide-react';

const PricingSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const pricingPlans = [
    {
      name: 'Mini',
      description: 'Perfect for casual listeners',
      price: '$2.99',
      duration: '/month',
      icon: User,
      popular: false,
      color: 'from-accent-blue to-cyan-400',
      features: [
        'Ad-free music on mobile',
        '30 hours of listening per month',
        'Basic audio quality',
        'Mobile only access',
        '1 account',
      ],
      cta: 'Start Mini Plan',
    },
    {
      name: 'Individual',
      description: 'Most popular choice',
      price: '$9.99',
      duration: '/month',
      icon: Sparkles,
      popular: true,
      color: 'from-spotify-green to-emerald-400',
      features: [
        'Ad-free music listening',
        'Unlimited skips',
        'High quality audio (320kbps)',
        'Offline downloads',
        'Listen on any device',
        'Personalized playlists',
      ],
      cta: 'Get Individual',
    },
    {
      name: 'Duo',
      description: 'For couples living together',
      price: '$12.99',
      duration: '/month',
      icon: Users,
      popular: false,
      color: 'from-accent-purple to-pink-400',
      features: [
        'All Individual features',
        '2 Premium accounts',
        'Duo Mix playlist',
        'Ad-free listening',
        'Offline downloads',
        'High quality audio',
      ],
      cta: 'Get Duo Plan',
    },
    {
      name: 'Family',
      description: 'Up to 6 Premium accounts',
      price: '$15.99',
      duration: '/month',
      icon: Home,
      popular: false,
      color: 'from-pink-500 to-rose-400',
      features: [
        'All Premium features',
        'Up to 6 accounts',
        'Family Mix playlist',
        'Parental controls',
        'Ad-free listening',
        'Offline downloads',
        'Block explicit music',
      ],
      cta: 'Get Family Plan',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-20 lg:py-32 bg-gradient-to-b from-spotify-dark to-spotify-black overflow-hidden"
      aria-label="Pricing Plans"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-spotify-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-spotify-green/10 to-accent-purple/10 backdrop-blur-sm border border-white/10 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-spotify-green" />
            <span className="text-sm font-medium text-white">Flexible Plans</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
            Pick Your{' '}
            <span className="bg-gradient-to-r from-spotify-green via-accent-blue to-accent-purple bg-clip-text text-transparent">
              Premium Plan
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-spotify-gray max-w-3xl mx-auto">
            Choose the perfect plan for your music needs. All plans include a 30-day free trial.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              plan={plan}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-12 lg:mt-16"
        >
          <p className="text-spotify-gray text-sm lg:text-base">
            All plans include a 30-day free trial. Cancel anytime.{' '}
            <a href="#" className="text-spotify-green hover:underline">
              Terms and conditions apply
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const PricingCard = ({ plan, isVisible, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${plan.popular ? 'lg:-mt-4' : ''}`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className={`px-4 py-1.5 bg-gradient-to-r ${plan.color} rounded-full shadow-lg`}>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Most Popular
            </span>
          </div>
        </motion.div>
      )}

      {/* Card */}
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className={`relative h-full p-6 lg:p-8 rounded-2xl overflow-hidden transition-all duration-300 ${
          plan.popular
            ? 'bg-gradient-to-br from-white/10 to-white/5 border-2 border-spotify-green shadow-2xl shadow-spotify-green/20'
            : 'bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20'
        }`}
      >
        {/* Background Gradient */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered || plan.popular ? 0.1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-0 bg-gradient-to-br ${plan.color}`}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className={`inline-flex p-3 bg-gradient-to-br ${plan.color} rounded-xl shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Plan Name */}
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            {plan.name}
          </h3>
          <p className="text-spotify-gray text-sm mb-6">{plan.description}</p>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-end mb-1">
              <span className="text-4xl lg:text-5xl font-bold text-white">
                {plan.price}
              </span>
              <span className="text-spotify-gray ml-2 mb-2">
                {plan.duration}
              </span>
            </div>
            <p className="text-xs text-spotify-gray">After 30-day free trial</p>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 lg:py-4 rounded-full font-bold transition-all duration-300 mb-6 ${
              plan.popular
                ? `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:shadow-xl`
                : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
            }`}
            aria-label={`Subscribe to ${plan.name} plan`}
          >
            {plan.cta}
          </motion.button>

          {/* Divider */}
          <div className="w-full h-px bg-white/10 mb-6" />

          {/* Features List */}
          <ul className="space-y-3">
            {plan.features.map((feature, featureIndex) => (
              <motion.li
                key={featureIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 + featureIndex * 0.05 }}
                className="flex items-start space-x-3"
              >
                <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mt-0.5`}>
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-spotify-gray group-hover:text-white transition-colors duration-300">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Decorative Elements */}
        {plan.popular && (
          <>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-spotify-green/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-spotify-green/20 rounded-full blur-3xl" />
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PricingSection;
