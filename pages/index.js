import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Tesseract from 'tesseract.js';

export default function SnapTextFinal() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(10);
  const [isPro, setIsPro] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false); 
  const [copyStatus, setCopyStatus] = useState("📋 COPIER LE TEXTE");

  const walletAddress = "TN6Gn74xuXqPpWx3Qd2cyWiiqYVBYr2E6P";
  const myEmail = "Honoratdariel@gmail.com";

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token') === 'DARIEL-PRO-2026') {
      localStorage.setItem('snaptext_status', 'pro');
      alert("🚀 Accès PRO activé ! Merci pour votre confiance, Dariel.");
    }

    const status = localStorage.getItem('snaptext_status');
    if (status === 'pro') {
      setIsPro(true);
      setCredits(999999);
    } else {
      const savedCredits = localStorage.getItem('snaptext_credits');
      if (savedCredits !== null) {
        setCredits(parseInt(savedCredits));
      } else {
        localStorage.setItem('snaptext_credits', '10');
        setCredits(10);
      }
    }
  }, []);

  const handleScan = async (file) => {
    if (!isPro && credits <= 0) {
      setShowModal(true);
      return;
    }
    if (!file) return;
    
    setLoading(true);
    setText(""); // On vide le texte précédent

    try {
      const result = await Tesseract.recognize(file, 'fra+eng');
      setText(result.data.text);
      
      if (!isPro) {
        const newCredits = credits - 1;
        setCredits(newCredits);
        localStorage.setItem('snaptext_credits', newCredits.toString());
      }
    } catch (err) {
      setText("Erreur : Impossible de lire l'image. Assurez-vous que le texte est bien visible.");
    } finally {
      setLoading(false);
    }
  };

  const cleanText = () => {
    let val = text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").replace(/([.!?])\s*/g, "$1\n").trim();
    setText(val);
  };

  const copyToClipboard = (content, type = "text") => {
    navigator.clipboard.writeText(content);
    if (type === "text") {
      setCopyStatus("✅ COPIÉ !");
      setTimeout(() => setCopyStatus("📋 COPIER LE TEXTE"), 2000);
    } else {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 8000);
    }
  };

  return (
    <div className="bg-[#FBFBFE] text-slate-900 min-h-screen font-sans selection:bg-blue-100 relative">
      <Head>
        <title>SnapText | Extraire le texte d'une image en 1 clic</title>
        <meta name="description" content="Transformez vos captures d'écran et photos de cours en texte modifiable instantanément. 100% privé." />
        <meta name="google-site-verification" content="yN4zDHUSHdjMwlhF_RdoxG3l2erKbrct6PKDDzRN-ig" />
      </Head>

      {/* TOAST NOTIFICATION (PAIEMENT) */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] w-[95%] max-w-md animate-in fade-in zoom-in slide-in-from-top-10">
          <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl border border-white/10 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 p-2 rounded-2xl text-xl">✅</div>
              <div>
                <h4 className="font-bold text-sm">Adresse USDT Copiée !</h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Envoyez <b className="text-white">0.50$</b> ou <b className="text-white">2$</b>, puis envoyez la preuve à : <span className="text-blue-400 font-bold underline">{myEmail}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 h-16 flex justify-between items-center">
        <h1 className="text-2xl font-black text-blue-600 italic tracking-tighter">SnapText.</h1>
        {isPro ? (
          <div className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest animate-pulse">
            ✨ Mode PRO Illimité
          </div>
        ) : (
          <div className="bg-slate-900 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-lg uppercase tracking-widest">
            {credits} / 10 scans gratuits
          </div>
        )}
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* HERO SECTION */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter text-slate-900">
            L'image devient <span className="text-blue-600 italic underline decoration-blue-100">texte</span>.
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Récupérez instantanément le texte de vos **captures d'écran**, **photos de cours** et **images**. 
            <br className="hidden md:block"/> 100% privé, 0% de saisie manuelle.
          </p>
        </div>

        {/* SCAN ZONE */}
        <div onClick={() => document.getElementById('up').click()} className="bg-white border-4 border-dashed border-slate-200 rounded-[3rem] p-16 text-center hover:border-blue-500 transition-all cursor-pointer group mb-12 shadow-sm relative">
          <input id="up" type="file" accept="image/*" className="hidden" onChange={(e) => handleScan(e.target.files[0])} />
          
          <div className="bg-blue-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-2xl shadow-blue-200 text-4xl">
            📝
          </div>

          <p className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">
            Importer pour <span className="text-blue-600">extraire le texte</span>
          </p>
          
          <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-[0.2em]">
            Sélectionnez une capture d'écran, un JPG ou un PNG
          </p>
          
          {loading && (
            <div className="mt-8 flex flex-col items-center">
              <div className="h-2 w-48 bg-blue-600 animate-pulse rounded-full shadow-lg shadow-blue-100"></div>
              <p className="text-blue-600 text-[10px] font-black mt-2 uppercase tracking-widest animate-bounce">Lecture de l'image par l'IA...</p>
            </div>
          )}
        </div>

        {/* OUTPUT AREA */}
        {text && (
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-5 mb-20">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Texte extrait avec succès</span>
              <div className="flex gap-3">
                <button onClick={cleanText} className="text-xs font-black bg-emerald-50 text-emerald-600 px-5 py-3 rounded-2xl hover:bg-emerald-100 transition-colors uppercase italic border border-emerald-100">✨ Nettoyer</button>
                <button onClick={() => copyToClipboard(text)} className="text-xs font-black bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-blue-300 hover:scale-105 transition-all uppercase italic tracking-tighter">{copyStatus}</button>
              </div>
            </div>
            <textarea className="w-full h-80 bg-slate-50 rounded-3xl p-8 text-slate-700 font-medium border-none text-lg leading-relaxed shadow-inner outline-none" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
        )}

        {/* ABOUT & CONTACT */}
        <section className="bg-slate-900 text-white rounded-[3.5rem] p-12 mb-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-6 italic text-blue-400 tracking-tight text-left">À propos de SnapText</h3>
            <div className="grid md:grid-cols-2 gap-12 text-sm text-left">
              <p className="text-slate-300 font-medium leading-relaxed">
                SnapText a été conçu par <b>Dariel</b> pour libérer les étudiants de la corvée de recopie. Vos données sont 100% privées car tout le traitement se fait localement.
              </p>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                <h4 className="font-bold text-blue-400 mb-2 italic">Validation Pro</h4>
                <p className="text-xs text-slate-400 mb-4 font-medium italic leading-relaxed">Envoyez votre preuve de paiement par mail pour débloquer l'accès illimité :</p>
                <p className="font-black text-blue-200 select-all tracking-tighter bg-blue-500/10 p-3 rounded-xl border border-blue-400/20">{myEmail}</p>
              </div>
            </div>
          </div>
        </section>

        {/* PAIEMENT USDT SECTION */}
        <section className="text-center bg-blue-600 text-white rounded-[3.5rem] p-16 shadow-2xl shadow-blue-200">
          <h4 className="text-3xl font-black mb-4 italic uppercase tracking-tighter underline decoration-white/20">Accès Illimité</h4>
          <p className="text-blue-100 text-sm mb-10 font-medium max-w-md mx-auto italic">Scannez sans aucune limite en soutenant le projet via USDT (TRC-20).</p>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between border border-white/20 max-w-2xl mx-auto shadow-inner">
              <code className="text-[10px] md:text-xs font-mono text-blue-100 truncate mr-2 mb-6 md:mb-0 opacity-80">{walletAddress}</code>
              <button onClick={() => copyToClipboard(walletAddress, "wallet")} className="bg-white text-blue-600 px-10 py-5 rounded-2xl text-sm font-black uppercase hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20">Copier & Payer</button>
          </div>
          <div className="flex justify-center gap-10 mt-10 text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
            <span>Pass 24h : 0.50$</span>
            <span>Abonnement : 2.00$</span>
          </div>
        </section>
      </main>

      <footer className="py-24 text-center opacity-40 italic">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">SnapText 2026 • Développé par Dariel</p>
      </footer>

      {/* PAYWALL MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/98 backdrop-blur-3xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[4rem] max-w-sm w-full p-12 shadow-2xl text-center">
            <div className="text-7xl mb-8 animate-bounce">⚡</div>
            <h3 className="text-4xl font-black mb-6 italic tracking-tighter text-slate-900 underline decoration-blue-100">Limite !</h3>
            <p className="text-slate-500 text-sm mb-12 leading-relaxed font-medium italic">Tes 10 extractions gratuites sont terminées. <br/>Passe en Mode Pro pour continuer.</p>
            <div className="space-y-4">
              <button onClick={() => copyToClipboard(walletAddress, "wallet")} className="w-full bg-slate-50 hover:bg-slate-100 py-5 rounded-[2rem] flex justify-between px-8 font-black transition-all border border-slate-200 italic shadow-sm tracking-tight text-slate-700"><span>Accès 24h</span><span className="text-blue-600">0.50$</span></button>
              <button onClick={() => copyToClipboard(walletAddress, "wallet")} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] flex justify-between px-8 font-black shadow-2xl shadow-blue-300 hover:scale-[1.05] transition-all italic tracking-tight"><span>Extractions Illimitées</span><span className="bg-white/20 px-3 py-1 rounded-xl text-[10px]">2$ / MOIS</span></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}