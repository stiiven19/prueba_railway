import { Link } from 'react-router-dom';

function HomePage() {
    return(
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Portal de Empleo</h1>
              <div className="grid grid-cols-1 gap-6 items-center">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700">Encuentra tu próxima oportunidad</h2>
                  <p className="text-gray-600 mb-4">
                    Portal de Empleo es tu plataforma para conectar talento con las mejores oportunidades laborales.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Busca vacantes personalizadas</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Postúlate con un solo clic</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Gestiona tu perfil profesional</span>
                    </div>
                  </div>
                  <div className="mt-6">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}

export default HomePage;