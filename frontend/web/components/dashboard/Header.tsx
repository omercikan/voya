interface DashboardHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const Header = ({ title, description, children }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/95 px-5 py-4 backdrop-blur">
      <div>
        <h1 className="font-bold text-2xl">{title}</h1>
        <p className="truncate text-sm text-muted-foreground">{description}</p>
      </div>

      {children}
    </header>
  );
};

export default Header;
