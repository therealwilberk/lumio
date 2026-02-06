import { motion } from 'framer-motion';

export function RocketLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12">
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-8xl"
      >
        🚀
      </motion.div>
      <motion.p
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xl font-medium text-gray-600 dark:text-gray-400"
      >
        Getting your challenges ready...
      </motion.p>
      
      {/* Animated dots */}
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-blue-500"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function MathLoader() {
  const symbols = ['➕', '➖', '✖️', '➗'];
  
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-12">
      <div className="flex gap-4">
        {symbols.map((symbol, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="text-4xl"
          >
            {symbol}
          </motion.div>
        ))}
      </div>
      <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
        Calculating your progress...
      </p>
    </div>
  );
}

export function StarLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12">
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        className="text-7xl"
      >
        ⭐
      </motion.div>
      <motion.p
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-lg font-medium text-gray-600 dark:text-gray-400"
      >
        Loading amazing content...
      </motion.p>
    </div>
  );
}

export function BouncingDotsLoader() {
  return (
    <div className="flex items-center justify-center gap-2 p-8">
      {['🔵', '🟢', '🟡', '🟠', '🔴'].map((emoji, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className="text-2xl"
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

export function ThinkingLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12">
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-7xl"
      >
        🤔
      </motion.div>
      <motion.p
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-lg font-medium text-gray-600 dark:text-gray-400"
      >
        Thinking...
      </motion.p>
      
      {/* Animated question marks */}
      <div className="flex gap-3">
        {['❓', '❔', '❓'].map((q, i) => (
          <motion.span
            key={i}
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.3
            }}
            className="text-2xl"
          >
            {q}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

// Mini loaders for inline use
export function MiniSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
    />
  );
}

export function PulseLoader() {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="w-3 h-3 rounded-full bg-blue-500"
    />
  );
}
