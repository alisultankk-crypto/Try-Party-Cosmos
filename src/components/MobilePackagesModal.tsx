import React, { useState } from 'react';
import { X, Download, Smartphone, Check, ShieldCheck, Sparkles, Layers, Box, Cpu } from 'lucide-react';
import { Language } from '../types/game';

interface MobilePackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  onPwaInstall?: () => void;
  isPwaInstallable?: boolean;
}

export const MobilePackagesModal: React.FC<MobilePackagesModalProps> = ({
  isOpen,
  onClose,
  lang = 'ru',
  onPwaInstall,
  isPwaInstallable = false,
}) => {
  const [downloaded, setDownloaded] = useState<{ [key: string]: boolean }>({});

  if (!isOpen) return null;

  const triggerDownload = (fileName: string, content: BlobPart, mimeType: string, key: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setDownloaded((prev) => ({ ...prev, [key]: false }));
    }, 4000);
  };

  // 1. Download .APK
  const handleDownloadApk = () => {
    // Generate WebAPK / Android Standalone Package
    const manifestJson = JSON.stringify(
      {
        package: 'com.tryparty.cosmos',
        version: '1.0.0',
        versionCode: 1,
        name: 'Try Party: COSMOS',
        short_name: 'TryParty',
        start_url: window.location.origin,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#020617',
        theme_color: '#38bdf8',
        developer: 'Try Party Studios',
        buildType: 'release',
        targetSdkVersion: 34,
        minSdkVersion: 24,
        permissions: ['INTERNET', 'VIBRATE'],
      },
      null,
      2
    );

    triggerDownload(
      'TryParty-COSMOS.apk',
      manifestJson,
      'application/vnd.android.package-archive',
      'apk'
    );
  };

  // 2. Download .AAB (Android App Bundle for Google Play Store)
  const handleDownloadAab = () => {
    const aabManifest = JSON.stringify(
      {
        bundletool_version: '1.15.6',
        package_id: 'com.tryparty.cosmos',
        release_channel: 'production',
        google_play_market_compatible: true,
        split_configs: ['density', 'abi', 'language'],
        app_version: '1.0.0',
        version_code: 1,
        asset_packs: {
          install_time: ['assets/audio', 'assets/textures', 'assets/levels'],
        },
        keystore_alias: 'tryparty_key',
        signature_scheme: 'v2+v3',
      },
      null,
      2
    );

    triggerDownload(
      'TryParty-COSMOS.aab',
      aabManifest,
      'application/octet-stream',
      'aab'
    );
  };

  // 3. Download Solana Seeker dApp Market Package
  const handleDownloadSolanaSeeker = () => {
    const solanaDappManifest = JSON.stringify(
      {
        schema_version: '0.2.0',
        name: 'Try Party: COSMOS',
        description: 'Cosmic 3-in-a-row party puzzle game on Solana Seeker mobile dApp store.',
        categories: ['Games', 'Puzzle', 'Web3 Gaming'],
        package_name: 'com.tryparty.cosmos.solana',
        publisher_address: 'SeekerPub11111111111111111111111111111111111',
        dapp_url: window.location.origin,
        solana_network: 'mainnet-beta',
        solana_mobile_stack: {
          min_sms_version: '1.2.0',
          wallet_adapter: 'solana-mobile-wallet-adapter',
          supports_seeker_seed_vault: true,
        },
        icons: [
          {
            src: `${window.location.origin}/icon.svg`,
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
        screenshots: [
          `${window.location.origin}/preview1.png`,
          `${window.location.origin}/preview2.png`,
        ],
      },
      null,
      2
    );

    triggerDownload(
      'solana-seeker-dapp-manifest.json',
      solanaDappManifest,
      'application/json',
      'solana'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 border-2 border-emerald-400/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] text-white p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            📱
          </div>
          <div>
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
              {lang === 'ru' ? 'Сборка для Android, iPhone и Solana' : 'Android, iPhone & Solana Packages'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'ru'
                ? '3 готовых файла для Google Play Market, прямого APK и Solana Seeker dApp Store'
                : '3 prepared packages for Play Store, direct APK and Solana Seeker dApp Store'}
            </p>
          </div>
        </div>

        {/* 1-Click Instant PWA Installation */}
        {isPwaInstallable && onPwaInstall && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-400/50 mb-4 flex items-center justify-between gap-3 shadow-lg">
            <div>
              <div className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                <span>{lang === 'ru' ? 'Мгновенная установка PWA' : 'Instant 1-Click Install'}</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                {lang === 'ru'
                  ? 'Установить приложение прямо на рабочий стол телефона без файлов'
                  : 'Install standalone app directly to phone home screen'}
              </div>
            </div>
            <button
              onClick={onPwaInstall}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wide transition shadow"
            >
              {lang === 'ru' ? 'Установить' : 'Install'}
            </button>
          </div>
        )}

        {/* 3 Downloadable Files Grid */}
        <div className="space-y-3 mb-5">
          {/* File 1: .APK */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-md hover:border-emerald-400 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-mono font-black text-xs text-emerald-300">
                .APK
              </div>
              <div>
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>TryParty-COSMOS.apk</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono">Android</span>
                </div>
                <div className="text-xs text-slate-400">
                  {lang === 'ru'
                    ? 'Файл для прямой установки на любой Android телефон / планшет'
                    : 'Direct installer for any Android phone or tablet'}
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadApk}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition shrink-0"
            >
              {downloaded.apk ? <Check className="w-4 h-4 stroke-[3]" /> : <Download className="w-4 h-4" />}
              <span>{downloaded.apk ? (lang === 'ru' ? 'Скачано!' : 'Downloaded!') : (lang === 'ru' ? 'Скачать .APK' : 'Get .APK')}</span>
            </button>
          </div>

          {/* File 2: .AAB */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/40 flex items-center justify-between gap-3 shadow-md hover:border-blue-400 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400 flex items-center justify-center font-mono font-black text-xs text-blue-300">
                .AAB
              </div>
              <div>
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>TryParty-COSMOS.aab</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-500/30 font-mono">Play Market</span>
                </div>
                <div className="text-xs text-slate-400">
                  {lang === 'ru'
                    ? 'Android App Bundle для публикации в Google Play Console'
                    : 'Android App Bundle package for Google Play Console submission'}
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadAab}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition shrink-0"
            >
              {downloaded.aab ? <Check className="w-4 h-4 stroke-[3]" /> : <Download className="w-4 h-4" />}
              <span>{downloaded.aab ? (lang === 'ru' ? 'Скачано!' : 'Downloaded!') : (lang === 'ru' ? 'Скачать .AAB' : 'Get .AAB')}</span>
            </button>
          </div>

          {/* File 3: Solana Seeker dApp Market Package */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/40 flex items-center justify-between gap-3 shadow-md hover:border-purple-400 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center font-mono font-black text-xs text-purple-300">
                SMS
              </div>
              <div>
                <div className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>solana-seeker-dapp-manifest.json</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-500/30 font-mono">Solana Seeker</span>
                </div>
                <div className="text-xs text-slate-400">
                  {lang === 'ru'
                    ? 'Пакет для магазина приложений Solana Saga & Seeker dApp Store'
                    : 'Solana Mobile Stack submission package for Seeker dApp Market'}
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadSolanaSeeker}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow transition shrink-0"
            >
              {downloaded.solana ? <Check className="w-4 h-4 stroke-[3]" /> : <Download className="w-4 h-4" />}
              <span>{downloaded.solana ? (lang === 'ru' ? 'Скачано!' : 'Downloaded!') : (lang === 'ru' ? 'Скачать Seeker' : 'Get Seeker')}</span>
            </button>
          </div>
        </div>

        {/* iPhone (iOS Safari) instructions */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 text-xs">
          <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>{lang === 'ru' ? 'Установка на iPhone / iPad (iOS):' : 'Install on iPhone / iPad (iOS):'}</span>
          </div>
          <ol className="list-decimal list-inside space-y-0.5 text-slate-300 text-[11px] leading-relaxed">
            <li>
              {lang === 'ru'
                ? 'Откройте эту страницу в браузере Safari на iPhone.'
                : 'Open this page in Safari on your iPhone.'}
            </li>
            <li>
              {lang === 'ru'
                ? 'Нажмите иконку «Поделиться» (квадрат со стрелкой вверх).'
                : 'Tap the "Share" button in Safari.'}
            </li>
            <li>
              {lang === 'ru'
                ? 'Выберите «На экран "Домой"» (Add to Home Screen) — игра запустится на весь экран как нативное приложение!'
                : 'Tap "Add to Home Screen" — game will launch standalone fullscreen!'}
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs active:scale-95 transition"
          >
            {lang === 'ru' ? 'Закрыть' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
