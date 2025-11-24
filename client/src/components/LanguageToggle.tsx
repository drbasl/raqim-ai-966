import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  // Update document direction and lang attribute
  useEffect(() => {
    const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 font-medium"
    >
      {currentLang === 'ar' ? (
        <>
          <span>عربي</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">EN</span>
        </>
      ) : (
        <>
          <span className="text-muted-foreground">عربي</span>
          <span className="text-muted-foreground">|</span>
          <span>EN</span>
        </>
      )}
    </Button>
  );
}
