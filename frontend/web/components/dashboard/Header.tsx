interface DashboardHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const Header = ({ title, description, children }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap gap-y-4 items-center justify-between gap-3 border-b border-border bg-card/95 px-6 py-4 backdrop-blur">
      <div>
        <h1 className="font-bold text-2xl">{title}</h1>
        <p className="truncate text-sm text-muted-foreground">{description}</p>
      </div>

      {children}
    </header>
  );
};

export default Header;
