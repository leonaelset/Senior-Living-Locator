'use client';

interface CommunityMapProps {
  address: string;
  name: string;
}

export default function CommunityMap({ address, name }: CommunityMapProps) {
  const query = encodeURIComponent(`${name}, ${address}`);

  return (
    <div className="mb-12">
      <h2 className="font-fraunces font-bold text-2xl text-[#1A1714] mb-5">Location</h2>
      <div className="rounded-2xl overflow-hidden border border-[#DDD6CC] h-72">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${query}&output=embed&z=15`}
        />
      </div>
      <p className="font-dm-sans text-sm text-[#7A6F65] mt-3">{address}</p>
    </div>
  );
}