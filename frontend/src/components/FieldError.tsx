import { AnimatePresence,motion } from "framer-motion";
import { AlertCircleIcon } from "lucide-react";

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          initial={{ opacity: 0, height: 0, y: -2 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -2 }}
          transition={{ duration: 0.18 }}
          role="alert"
          className="mt-1 text-xs text-rose-400 flex items-center gap-1 font-normal"
        >
          <AlertCircleIcon size={13} className="shrink-0" />
          <span>{message}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default FieldError;
