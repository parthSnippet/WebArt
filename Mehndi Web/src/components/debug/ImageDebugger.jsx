import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDesigns } from '../../redux/designSlice';

const ImageDebugger = () => {
  const dispatch = useDispatch();
  const { designs, loading, error } = useSelector(s => s.designs);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    console.log('🔍 ImageDebugger: Component mounted, fetching designs...');
    dispatch(fetchDesigns());
  }, [dispatch]);

  useEffect(() => {
    // Test API connectivity
    const testAPI = async () => {
      try {
        console.log('🔍 Testing API connectivity...');
        
        // Test health endpoint
        const healthRes = await fetch('http://localhost:5000/api/health');
        const healthData = await healthRes.json();
        console.log('🔍 Health check:', healthData);
        
        // Test uploads debug endpoint
        const uploadsRes = await fetch('http://localhost:5000/api/debug/uploads');
        const uploadsData = await uploadsRes.json();
        console.log('🔍 Uploads debug:', uploadsData);
        
        setDebugInfo({
          health: healthData,
          uploads: uploadsData,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('🔍 API test failed:', error);
        setDebugInfo({
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    };
    
    testAPI();
  }, []);

  return (
    <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">🔍 Image Debug Panel</h2>
      
      {/* API Debug Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">API Debug Info:</h3>
        <pre className="bg-black/30 p-4 rounded-lg text-green-400 text-sm overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
      
      {/* Redux State */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Redux State:</h3>
        <div className="bg-black/30 p-4 rounded-lg text-blue-400 text-sm">
          <p>Loading: {loading ? 'true' : 'false'}</p>
          <p>Error: {error || 'none'}</p>
          <p>Designs Count: {designs?.length || 0}</p>
        </div>
      </div>
      
      {/* Designs List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Designs Data:</h3>
        <div className="space-y-4 max-h-96 overflow-auto">
          {designs?.map((design, index) => (
            <div key={design._id} className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Design #{index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-sm">
                  <p className="text-gray-300">ID: {design._id}</p>
                  <p className="text-gray-300">Title: {design.title}</p>
                  <p className="text-gray-300">Category: {design.category}</p>
                  <p className="text-gray-300">Image URL: {design.imageUrl}</p>
                </div>
                <div>
                  <p className="text-white mb-2">Image Test:</p>
                  <img 
                    src={design.imageUrl} 
                    alt={design.title}
                    className="w-32 h-32 object-cover rounded-lg border-2 border-white/20"
                    onLoad={() => console.log('✅ Image loaded:', design.imageUrl)}
                    onError={(e) => {
                      console.error('❌ Image failed:', design.imageUrl);
                      e.target.style.border = '2px solid red';
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {designs?.length === 0 && (
            <p className="text-white/60 text-center py-8">No designs found</p>
          )}
        </div>
      </div>
      
      {/* Manual Image Test */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Manual Image Test:</h3>
        <div className="bg-black/30 p-4 rounded-lg">
          <p className="text-white mb-2">Test direct image URL:</p>
          <img 
            src="http://localhost:5000/uploads/test.jpg" 
            alt="Test"
            className="w-32 h-32 object-cover rounded-lg border-2 border-white/20"
            onLoad={() => console.log('✅ Manual test image loaded')}
            onError={(e) => {
              console.error('❌ Manual test image failed');
              e.target.style.border = '2px solid red';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageDebugger;