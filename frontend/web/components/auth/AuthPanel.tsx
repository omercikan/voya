import { PiCarProfile } from "react-icons/pi";
import { BiCheckShield } from "react-icons/bi";

const AuthPanel = () => {
  return (
    <div className="hidden flex-col justify-between bg-sidebar p-12 lg:flex">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-md bg-sidebar-primary font-bold text-sidebar-primary-foreground">
          YT
        </div>

        <div>
          <strong className="font-display text-lg font-bold tracking-[0.2em] text-sidebar-foreground">
            YALTES
          </strong>
          <p className="text-xs text-sidebar-foreground/60">Araç Randevu</p>
        </div>
      </div>

      <div className="max-w-md">
        <h2 className="font-display text-3xl font-bold leading-snug text-sidebar-foreground">
          Şirket araç rezervasyonları, tek bir yerden yönetilir.
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/70">
          Seyahatiniz için bir şirket aracını rezerve edin, onay durumunu takip
          edin ve yöneticilerin talepleri incelemesine olanak sağlayın — tüm
          bunları kurumsal ağ içinde gerçekleştirin.
        </p>

        <ul className="mt-8 space-y-3 text-sm text-sidebar-foreground/80">
          <li className="flex items-center gap-3">
            <PiCarProfile color="0891c9" />
            Araçların gerçek zamanlı kullanılabilirliği
          </li>

          <li className="flex items-center gap-3">
            <BiCheckShield color="0891c9" />
            Yönetici onay iş akışı
          </li>
        </ul>
      </div>

      <p className="text-xs text-sidebar-foreground/50">
        © 2026 YALTES · Yalnızca kurum içi kullanım içindir
      </p>
    </div>
  );
};

export default AuthPanel;
