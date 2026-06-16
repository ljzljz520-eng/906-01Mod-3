<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/SearchHistory.php';
require_once __DIR__ . '/../models/Favorite.php';

class ApiController {
    private $db;
    private $searchHistory;
    private $favorite;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->searchHistory = new SearchHistory($this->db);
        $this->favorite = new Favorite($this->db);
    }

    // GET /health
    public function healthCheck() {
        echo json_encode([
            'status' => 'ok',
            'timestamp' => date('c'),
            'service' => 'Torrent Search API (PHP)'
        ]);
    }

    // GET /api/providers
    public function getProviders() {
        // Mocking providers since we use demo data
        echo json_encode([
            'success' => true,
            'data' => [
                'all' => ['1337x', 'Yts', 'ThePirateBay', 'Rarbg', 'Torrent9'],
                'active' => ['1337x', 'Yts']
            ]
        ]);
    }

    // GET /api/search/:keyword/:query/:page
    public function search($keyword, $query, $page = 1) {
        // Save history
        $this->searchHistory->keyword = $keyword;
        $this->searchHistory->query = $query;
        $this->searchHistory->create();

        // Generate demo data
        $results = $this->generateDemoData($query, $keyword, $page);

        echo json_encode([
            'success' => true,
            'data' => $results,
            'meta' => [
                'keyword' => $keyword,
                'query' => $query,
                'page' => (int)$page,
                'count' => count($results),
                'demo' => true
            ]
        ]);
    }

    // GET /api/history
    public function getHistory() {
        $limit = isset($_GET['limit']) ? $_GET['limit'] : 20;
        $history = $this->searchHistory->findAll($limit);

        echo json_encode([
            'success' => true,
            'data' => $history
        ]);
    }

    // DELETE /api/history
    public function clearHistory() {
        if ($this->searchHistory->deleteAll()) {
            echo json_encode(['success' => true, 'message' => '搜索历史已清空']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => '清空搜索历史失败']);
        }
    }

    // POST /api/favorites
    public function addFavorite() {
        $data = json_decode(file_get_contents("php://input"));

        if (!$data) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
            return;
        }

        // Check existing
        if ($this->favorite->findOneByMagnet($data->magnet)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => '该资源已在收藏列表中']);
            return;
        }

        $this->favorite->name = $data->name;
        $this->favorite->magnet = $data->magnet;
        $this->favorite->size = $data->size;
        $this->favorite->seeders = $data->seeders ?? 0;
        $this->favorite->leechers = $data->leechers ?? 0;
        $this->favorite->category = $data->category;
        $this->favorite->source = $data->source;
        $this->favorite->license = $data->license ?? null;
        $this->favorite->license_url = $data->license_url ?? null;

        if ($this->favorite->create()) {
            echo json_encode([
                'success' => true, 
                'message' => '收藏成功', 
                'data' => $this->favorite
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => '收藏失败']);
        }
    }

    // GET /api/favorites
    public function getFavorites() {
        $favorites = $this->favorite->findAll();
        echo json_encode([
            'success' => true,
            'data' => $favorites
        ]);
    }

    // DELETE /api/favorites/:id
    public function deleteFavorite($id) {
        if ($this->favorite->delete($id)) {
            echo json_encode(['success' => true, 'message' => '删除成功']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => '收藏不存在']);
        }
    }

    private function generateDemoData($query, $provider, $page) {
        $demoTorrents = [];
        
        $licenses = [
            ['type' => 'MIT', 'url' => 'https://opensource.org/licenses/MIT'],
            ['type' => 'Apache-2.0', 'url' => 'https://www.apache.org/licenses/LICENSE-2.0'],
            ['type' => 'GPL-3.0', 'url' => 'https://www.gnu.org/licenses/gpl-3.0.en.html'],
            ['type' => 'AGPL-3.0', 'url' => 'https://www.gnu.org/licenses/agpl-3.0.en.html'],
            ['type' => 'BSD-3-Clause', 'url' => 'https://opensource.org/licenses/BSD-3-Clause'],
            ['type' => 'MPL-2.0', 'url' => 'https://www.mozilla.org/en-US/MPL/2.0/'],
            ['type' => 'LGPL-3.0', 'url' => 'https://www.gnu.org/licenses/lgpl-3.0.en.html'],
            ['type' => 'Unlicense', 'url' => 'https://unlicense.org/'],
            ['type' => null, 'url' => null],
            ['type' => 'SSPL', 'url' => 'https://www.mongodb.com/licensing/server-side-public-license'],
        ];
        
        $categories = ['Software', 'Library', 'Framework', 'Database', 'Tools', 'SDK'];
        
        $seed = crc32($query . $provider . $page);
        
        $count = 5;
        for ($i = 0; $i < $count; $i++) {
            $hash = abs(crc32($query . $provider . $page . $i));
            $randomString = strtoupper(substr(hash('sha256', $query . $i), 0, 6));
            $licenseInfo = $licenses[$hash % count($licenses)];
            $category = $categories[($hash >> 4) % count($categories)];
            
            $versionMajor = ($hash % 10) + 1;
            $versionMinor = (($hash >> 8) % 10);
            $versionPatch = (($hash >> 16) % 100);
            $sizeValue = (($hash >> 4) % 20) + 1;
            $sizeDecimal = (($hash >> 12) % 100);
            $seeders = (($hash >> 8) % 1950) + 50;
            $leechers = (($hash >> 16) % 490) + 10;
            $daysAgo = (($hash >> 4) % 30) + 1;
            
            $resourceUrl = "https://example.com/project/" . strtolower(str_replace(' ', '-', $query)) . "-$i";
            $licenseUrl = $licenseInfo['type'] ? $resourceUrl . '/blob/main/LICENSE' : null;
            
            $item = [
                'Name' => "$query " . ucfirst($category) . " v$versionMajor.$versionMinor.$versionPatch [$provider]",
                'Magnet' => "magnet:?xt=urn:btih:DEMO$randomString&dn=" . urlencode($query),
                'Size' => "$sizeValue.$sizeDecimal GB",
                'Seeders' => $seeders,
                'Leechers' => $leechers,
                'Category' => $category,
                'Url' => $resourceUrl,
                'DateUploaded' => "$daysAgo days ago",
                'License' => $licenseInfo['type'],
                'LicenseUrl' => $licenseUrl
            ];
            $demoTorrents[] = $item;
        }
        return $demoTorrents;
    }
}
