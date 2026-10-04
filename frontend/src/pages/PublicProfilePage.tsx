import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, BookOpen, MapPin, MessageCircle } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { usersApi } from '../services/api';

type Profile = {
  _id: string; name: string; role: string; profilePicture?: string; headline?: string;
  expertiseArea?: string; location?: string; about?: string; skills?: string[];
  education?: string; experience?: string; isVerified?: boolean;
};

export const PublicProfilePage: React.FC = () => {
  const { profileId = '' } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    usersApi.byId(profileId)
      .then(response => { if (active) setProfile(response.data?.data?.user || null); })
      .catch(() => { if (active) setError('This profile could not be loaded.'); });
    return () => { active = false; };
  }, [profileId]);

  return (
    <MainLayout showRightRail={false}>
      <div className="max-w-3xl mx-auto glass-panel rounded-3xl border border-white/10 p-6 sm:p-10 text-white">
        <Link to="/search" className="inline-flex items-center gap-2 text-sm text-purple-300 hover:text-white"><ArrowLeft size={16} /> Back to search</Link>
        {error ? <p className="mt-8 text-rose-300">{error}</p> : profile ? <>
          <div className="flex items-center gap-5 mt-8">
            <img src={profile.profilePicture || '/infonest-logo.png'} alt="" className="w-20 h-20 rounded-2xl object-cover" />
            <div><div className="flex items-center gap-2"><h1 className="text-2xl font-black">{profile.name}</h1>{profile.isVerified && <BadgeCheck className="text-cyan-300" size={18} />}</div><p className="text-slate-300">{profile.headline || profile.expertiseArea || profile.role}</p>{profile.location && <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={13} />{profile.location}</p>}</div>
          </div>
          <button onClick={() => navigate(`/messages?userId=${encodeURIComponent(profile._id)}`)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500"><MessageCircle size={16}/> Message</button>
          {profile.about && <section className="mt-8"><h2 className="font-bold">About</h2><p className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">{profile.about}</p></section>}
          {!!profile.skills?.length && <section className="mt-6"><h2 className="font-bold flex items-center gap-2"><BookOpen size={16} /> Skills</h2><div className="flex flex-wrap gap-2 mt-3">{profile.skills.map(skill => <span key={skill} className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/20 text-xs text-purple-200">{skill}</span>)}</div></section>}
          {profile.education && <section className="mt-6"><h2 className="font-bold">Education</h2><p className="text-sm text-slate-300 mt-2">{profile.education}</p></section>}
          {profile.experience && <section className="mt-6"><h2 className="font-bold">Experience</h2><p className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">{profile.experience}</p></section>}
        </> : <p className="mt-8 text-slate-300">Loading profile�</p>}
      </div>
    </MainLayout>
  );
};
