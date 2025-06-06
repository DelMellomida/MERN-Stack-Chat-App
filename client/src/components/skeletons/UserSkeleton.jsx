import React from 'react'

const UserSkeleton = () => {
    const skeletonUsers = Array(8).fill(null);
    return (
        <div className="p-4 space-y-3">
            {skeletonUsers.map((_, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2">
                    <div className="skeleton rounded-full w-10 h-10" />
                    <div className="flex-1">
                        <div className="skeleton h-4 w-32 mb-1" />
                        <div className="skeleton h-3 w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserSkeleton