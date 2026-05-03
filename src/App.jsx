import { useState } from 'react'
import { Brain, Target, Sparkles, Users, Package, Activity, Fingerprint, FlaskConical, Heart, Star, Tag, ChevronRight, Layers, Settings, ClipboardList, ShieldCheck, Thermometer, Droplets, User, Info } from 'lucide-react'

const API_BASE_URL = 'https://bckendml.onrender.com/api'

// Skin type emoji & color mapping
const SKIN_MAP = {
  'Dry': { emoji: '🏜️', color: '#ff2d78', desc: 'Peau Sèche' },
  'Oily': { emoji: '✨', color: '#ff6b3d', desc: 'Peau Grasse' },
  'Normal': { emoji: '🌿', color: '#10b981', desc: 'Peau Normale' },
  'Combination': { emoji: '⚖️', color: '#8b5cf6', desc: 'Peau Mixte' },
}

// Cluster color mapping
const CLUSTER_COLOR = {
  '0': '#ff2d78',
  '1': '#ff6b3d',
  '2': '#10b981',
  'Anomalie (Bruit DBSCAN)': '#0f172a',
}

// Model labels
const MODEL_LABELS = {
  rf: { label: 'Random Forest', tag: 'RF' },
  xgb: { label: 'XGBoost', tag: 'XGB' },
  ann: { label: 'Neural Network', tag: 'ANN' },
  kmeans: { label: 'K-Means', tag: 'K-Means' },
  dbscan: { label: 'DBSCAN', tag: 'DBSCAN' },
  knn: { label: 'K-NN', tag: 'KNN' },
}

function ModelBadge({ model }) {
  const info = MODEL_LABELS[model] || { label: model, tag: model?.toUpperCase() }
  return <span className="model-tag">{info.tag}</span>
}



function App() {
  const [activeTab, setActiveTab] = useState('skin')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isMock, setIsMock] = useState(false)

  const [skinForm, setSkinForm] = useState({ age: 25, humidity: 50, temperature: 20, sensitivity: 'Medium', model_choice: 'rf' })
  const [patientForm, setPatientForm] = useState({ age: 30, gender: 'Female', blood_type: 'A+', model_choice: 'kmeans' })
  const [productForm, setProductForm] = useState({ loves_count: 5000, rating: 4.5, reviews: 200, price_usd: 40, child_max_price: 60, child_min_price: 20, model_choice: 'ann' })

  const handlePredict = async (e, endpoint, data) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)
    setIsMock(false)

    try {
      const res = await fetch(`${API_BASE_URL}/predict/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      if (!res.ok || json.status === 'error') throw new Error(json.message || 'Erreur API')
      if (json.status === 'mock') setIsMock(true)

      if (endpoint === 'skin') setResult({ type: 'skin', prediction: json.prediction, confidence: json.confidence, model_used: json.model_used })
      if (endpoint === 'patient') {
        const cluster = json.cluster !== undefined ? (json.cluster === 'Anomalie (Bruit DBSCAN)' ? json.cluster : `${json.cluster}`) : json.prediction
        setResult({ type: 'patient', cluster, model_used: json.model_used })
      }
      if (endpoint === 'product') setResult({ type: 'product', category: json.category, products: json.products, confidence: json.confidence, model_used: json.model_used })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => { setActiveTab(tab); setResult(null); setError(null) }

  const skinInfo = result?.type === 'skin' ? SKIN_MAP[result.prediction] || { emoji: '', color: '#a3949e', desc: result.prediction } : null

  return (
    <div className="app-container">
      {/* HEADER */}
      <header>
        <div className="header-badge"> Projet ML · DeepSkyn</div>
        <h1>DeepSkyn AI Hub</h1>
        <p className="subtitle">Comparez vos modèles Machine Learning en temps réel</p>
        <div className="header-stats">
          <div className="stat-pill pink">
            <Brain size={16} />
            <span>6 Modèles</span>
          </div>
          <div className="stat-pill orange">
            <Target size={16} />
            <span>3 Objectifs</span>
          </div>
          <div className="stat-pill teal">
            <Sparkles size={16} />
            <span>Skincare IA</span>
          </div>
        </div>
      </header>

      {/* TABS */}
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'skin' ? 'active' : ''}`} onClick={() => handleTabChange('skin')}>
          <Sparkles size={18} />
          <span>Type de Peau</span>
        </button>
        <button className={`tab-btn ${activeTab === 'patient' ? 'active' : ''}`} onClick={() => handleTabChange('patient')}>
          <Users size={18} />
          <span>Segmentation Patient</span>
        </button>
        <button className={`tab-btn ${activeTab === 'product' ? 'active' : ''}`} onClick={() => handleTabChange('product')}>
          <Package size={18} />
          <span>Recommandation Produit</span>
        </button>
      </div>

      <main>
        {/* ========== TAB 1: SKIN TYPE ========== */}
        {activeTab === 'skin' && (
          <div className="model-container">
            <div className="model-header">
              <div className="model-header-icon"><Layers size={32} /></div>
              <h2>Prédiction du Type de Peau</h2>
              <p><Activity size={14} /> Random Forest · XGBoost</p>
              <div className="model-chips">
                <span className="chip chip-rf">RF</span>
                <span className="chip chip-xgb">XGB</span>
              </div>
            </div>
            <form onSubmit={(e) => handlePredict(e, 'skin', skinForm)}>
              <div className="form-grid">
                <div className="input-group full-width">
                  <label><Settings size={14} /> Modèle IA à utiliser</label>
                  <select value={skinForm.model_choice} onChange={e => setSkinForm({ ...skinForm, model_choice: e.target.value })}>
                    <option value="rf"> Random Forest</option>
                    <option value="xgb"> XGBoost</option>
                  </select>
                </div>
                <div className="input-group">
                  <label><User size={14} /> Âge du patient</label>
                  <input type="number" min="1" max="120" required value={skinForm.age} onChange={e => setSkinForm({ ...skinForm, age: e.target.value })} placeholder="Ex: 25" />
                </div>
                <div className="input-group">
                  <label><ShieldCheck size={14} /> Sensibilité cutanée</label>
                  <select value={skinForm.sensitivity} onChange={e => setSkinForm({ ...skinForm, sensitivity: e.target.value })}>
                    <option value="Low"> Basse (Low)</option>
                    <option value="Medium"> Moyenne (Medium)</option>
                    <option value="High"> Haute (High)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label><Droplets size={14} /> Humidité ambiante (%)</label>
                  <input type="number" step="0.1" min="0" max="100" required value={skinForm.humidity} onChange={e => setSkinForm({ ...skinForm, humidity: e.target.value })} placeholder="Ex: 50" />
                </div>
                <div className="input-group">
                  <label><Thermometer size={14} /> Température (°C)</label>
                  <input type="number" step="0.1" required value={skinForm.temperature} onChange={e => setSkinForm({ ...skinForm, temperature: e.target.value })} placeholder="Ex: 20" />
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <span><div className="loader"></div> Analyse en cours…</span> : <><Sparkles size={18} /> Analyser le Type de Peau</>}
              </button>
            </form>

            {/* SKIN RESULT */}
            {result?.type === 'skin' && skinInfo && (
              <div className="result-card" style={{ borderColor: `${skinInfo.color}40`, background: `${skinInfo.color}0a` }}>
                <div className="result-label"><Activity size={16} /> Résultat de l'analyse</div>

                <div className="result-value" style={{ color: skinInfo.color }}>{skinInfo.desc}</div>

                <div className="result-meta">
                  Modèle : <ModelBadge model={result.model_used} />
                  {isMock && <span className="result-mock-badge">Mode Démo</span>}
                </div>
              </div>
            )}
            {error && <div className="error-message">️ {error}</div>}
          </div>
        )}

        {/* ========== TAB 2: PATIENT ========== */}
        {activeTab === 'patient' && (
          <div className="model-container">
            <div className="model-header">
              <div className="model-header-icon"><Users size={32} /></div>
              <h2>Segmentation Patient</h2>
              <p><Fingerprint size={14} /> K-Means Clustering · DBSCAN Density</p>
              <div className="model-chips">
                <span className="chip chip-rf">K-Means</span>
                <span className="chip chip-xgb">DBSCAN</span>
              </div>
            </div>

            {/* ===== CLUSTER INFO SECTION ===== */}
            <div className="cluster-info-section">


              <div className="clusters-grid">
                <div className="cluster-card cluster-0">
                  <div className="cluster-number">Cluster 0</div>

                  <div className="cluster-name">Femmes Jeunes & Actives</div>
                  <div className="cluster-desc">Patientes féminines de 18 à 40 ans avec groupes sanguins courants (A+, O+). Peau souvent sensible aux changements hormonaux. Besoins : <em>hydratation, protection solaire, anti-acné</em>.</div>
                  <div className="cluster-tags">
                    <span>️ Genre : Féminin</span>
                    <span> Âge : 18–40</span>
                    <span>🩸 A+, O+</span>
                  </div>
                </div>

                <div className="cluster-card cluster-1">
                  <div className="cluster-number">Cluster 1</div>

                  <div className="cluster-name">Hommes Adultes</div>
                  <div className="cluster-desc">Patients masculins de tout âge avec groupes sanguins variés. Peau souvent grasse ou mixte, sujette au soleil et au rasage. Besoins : <em>sébum control, soin post-rasage, SPF</em>.</div>
                  <div className="cluster-tags">
                    <span>️ Genre : Masculin</span>
                    <span> Âge : 20–60</span>
                    <span>🩸 B+, AB+</span>
                  </div>
                </div>

                <div className="cluster-card cluster-2">
                  <div className="cluster-number">Cluster 2</div>

                  <div className="cluster-name">Seniors & Profils Rares</div>
                  <div className="cluster-desc">Patients plus âgés (50+) ou avec groupes sanguins rares (A−, B−, AB−, O−). Peau mature avec besoins spécifiques. Besoins : <em>anti-âge, nutrition intense, collagène</em>.</div>
                  <div className="cluster-tags">
                    <span> Âge : 50+</span>
                    <span>🩸 A−, B−, O−</span>
                    <span>️ Groupes rares</span>
                  </div>
                </div>

              </div>

            </div>

            <form onSubmit={(e) => handlePredict(e, 'patient', patientForm)}>
              <div className="form-grid">
                <div className="input-group full-width">
                  <label><Activity size={14} /> Algorithme de clustering</label>
                  <select value={patientForm.model_choice} onChange={e => setPatientForm({ ...patientForm, model_choice: e.target.value })}>
                    <option value="kmeans"> K-Means (Clustering par centre)</option>
                    <option value="dbscan"> DBSCAN (Densité & Détection anomalies)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label> Âge du patient</label>
                  <input type="number" min="1" max="120" required value={patientForm.age} onChange={e => setPatientForm({ ...patientForm, age: e.target.value })} placeholder="Ex: 30" />
                </div>
                <div className="input-group">
                  <label> Genre</label>
                  <select value={patientForm.gender} onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })}>
                    <option value="Female">️ Femme</option>
                    <option value="Male">️ Homme</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>🩸 Groupe Sanguin</label>
                  <select value={patientForm.blood_type} onChange={e => setPatientForm({ ...patientForm, blood_type: e.target.value })}>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <span><div className="loader"></div> Segmentation…</span> : <><Fingerprint size={18} /> Segmenter le Patient</>}
              </button>
            </form>

            {/* PATIENT RESULT */}
            {result?.type === 'patient' && result.cluster !== undefined && (
              <div className="result-card" style={{
                borderColor: `${CLUSTER_COLOR[result.cluster] || '#d16b8d'}50`,
                background: `${CLUSTER_COLOR[result.cluster] || '#d16b8d'}0a`
              }}>
                <div className="result-label">{result.cluster === 'Anomalie (Bruit DBSCAN)' ? <><Activity size={16} /> Profil Atypique</> : <><Users size={16} /> Segment identifié</>}</div>

                <div className="result-value" style={{ color: CLUSTER_COLOR[result.cluster] || '#d16b8d' }}>
                  {result.cluster === 'Anomalie (Bruit DBSCAN)' ? 'Anomalie' : `Cluster ${result.cluster}`}
                </div>
                {result.cluster === 'Anomalie (Bruit DBSCAN)' && (
                  <p className="result-note">Ce patient présente un profil trop atypique pour être classé dans un groupe standard (DBSCAN Bruit).</p>
                )}
                <div className="result-meta">
                  Modèle : <ModelBadge model={result.model_used} />
                  {isMock && <span className="result-mock-badge">Mode Démo</span>}
                </div>
              </div>
            )}
            {error && <div className="error-message">️ {error}</div>}
          </div>
        )}

        {/* ========== TAB 3: PRODUCT ========== */}
        {activeTab === 'product' && (
          <div className="model-container">
            <div className="model-header">
              <div className="model-header-icon"><Package size={32} /></div>
              <h2>Recommandation Skincare</h2>
              <p><FlaskConical size={14} /> Neural Network · K-Nearest Neighbors</p>
              <div className="model-chips">
                <span className="chip chip-ann">ANN</span>
                <span className="chip chip-knn">KNN</span>
              </div>
            </div>
            <form onSubmit={(e) => handlePredict(e, 'product', productForm)}>
              <div className="form-grid">
                <div className="input-group full-width">
                  <label><Settings size={14} /> Modèle de recommandation</label>
                  <select value={productForm.model_choice} onChange={e => setProductForm({ ...productForm, model_choice: e.target.value })}>
                    <option value="ann"> Neural Network (ANN / MLP)</option>
                    <option value="knn"> K-Nearest Neighbors (KNN)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label><Heart size={14} /> Nombre de "Loves"</label>
                  <input type="number" min="0" required value={productForm.loves_count} onChange={e => setProductForm({ ...productForm, loves_count: e.target.value })} placeholder="Ex: 5000" />
                </div>
                <div className="input-group">
                  <label><Star size={14} /> Note moyenne (0–5)</label>
                  <input type="number" step="0.1" min="0" max="5" required value={productForm.rating} onChange={e => setProductForm({ ...productForm, rating: e.target.value })} placeholder="Ex: 4.5" />
                </div>
                <div className="input-group">
                  <label><ClipboardList size={14} /> Nombre de Reviews</label>
                  <input type="number" min="0" required value={productForm.reviews} onChange={e => setProductForm({ ...productForm, reviews: e.target.value })} placeholder="Ex: 200" />
                </div>
                <div className="input-group">
                  <label> Prix max variante ($)</label>
                  <input type="number" step="0.1" min="0" required value={productForm.child_max_price} onChange={e => setProductForm({ ...productForm, child_max_price: e.target.value })} placeholder="Ex: 60" />
                </div>
                <div className="input-group">
                  <label> Prix min variante ($)</label>
                  <input type="number" step="0.1" min="0" required value={productForm.child_min_price} onChange={e => setProductForm({ ...productForm, child_min_price: e.target.value })} placeholder="Ex: 20" />
                </div>
                <div className="input-group">
                  <label><Tag size={14} /> Mon budget ($)</label>
                  <input type="number" step="0.1" min="0" required value={productForm.price_usd} onChange={e => setProductForm({ ...productForm, price_usd: e.target.value })} placeholder="Ex: 40" />
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <span><div className="loader"></div> Recherche des meilleurs produits…</span> : <><FlaskConical size={18} /> Trouver les Meilleurs Produits</>}
              </button>
            </form>

            {/* PRODUCT RESULT */}
            {result?.type === 'product' && (
              <div className="result-card product-result-card">
                <div className="result-label"><Heart size={16} /> Recommandations IA</div>
                <div className="product-cat-header">
                  <span className="product-cat-badge"> {result.category}</span>

                  <div className="result-meta" style={{ marginTop: '0.8rem' }}>
                    Modèle : <ModelBadge model={result.model_used} />
                  </div>
                </div>
                <div className="products-grid">
                  {result.products && result.products.map((prod, idx) => (
                    <div key={idx} className="product-item" style={{ animationDelay: `${idx * 0.08}s` }}>
                      <div className="prod-rank">#{idx + 1}</div>
                      <div className="prod-brand">{prod.brand}</div>
                      <div className="prod-name">{prod.name}</div>
                      <div className="prod-meta">
                        <span className="prod-rating"> {prod.rating}</span>
                        <span className="prod-price">${prod.price}</span>
                      </div>
                      {prod.reviews && <div className="prod-reviews"> {prod.reviews.toLocaleString()} avis</div>}
                    </div>
                  ))}
                </div>
                {isMock && <div className="result-mock-badge">Mode Démo – données simulées</div>}
              </div>
            )}
            {error && <div className="error-message">️ {error}</div>}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div>
            <strong>DeepSkyn AI Hub</strong> — Projet Machine Learning
          </div>
          <div className="footer-models">
            <span> Random Forest</span>
            <span> XGBoost</span>
            <span> ANN</span>
            <span> K-Means</span>
            <span> DBSCAN</span>
            <span> KNN</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
