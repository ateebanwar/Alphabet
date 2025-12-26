import { motion } from "framer-motion";
import { CircleData } from "@/data/circleData";

interface CircleContentProps {
  circle: CircleData;
}

const CircleContent = ({ circle }: CircleContentProps) => {
  const Icon = circle.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full flex flex-col items-center justify-start p-6 md:p-12 pb-20"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-center mt-12 md:mt-8 mb-6"
      >
        <div className="neu-circle w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
          {circle.content.title}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
          {circle.content.description}
        </p>
      </motion.div>

      {/* Content Grid */}
      {circle.content.items && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full max-w-lg"
        >
          {circle.content.items.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.08, duration: 0.3 }}
                className="neu-tile flex items-start gap-3 p-4"
              >
                {ItemIcon && (
                  <div className="neu-circle-pressed w-10 h-10 flex items-center justify-center shrink-0">
                    <ItemIcon className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm md:text-base truncate">
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CircleContent;
