import { useTheme } from '../hooks/useTheme';
import Moon from '../Assets/Moon.svg';
import Sun from '../Assets/Sun.svg';

export const ThemeToggle = (): JSX.Element => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label={`Mudar para tema ${isDark ? 'claro' : 'escuro'}`}
    >
      {/* Use img tag com a URL importada */}
      <img 
        src={isDark ? Sun : Moon} 
        alt="theme icon"
        className="w-6 h-6"
      />
    </button>
  );
};