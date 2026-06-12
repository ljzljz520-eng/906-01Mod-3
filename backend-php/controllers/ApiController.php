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
        
        $count = 5;
        for ($i = 0; $i < $count; $i++) {
            $randomString = substr(str_shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 6);
            $licenseInfo = $licenses[array_rand($licenses)];
            $category = $categories[array_rand($categories)];
            
            $item = [
                'Name' => "$query " . ucfirst($category) . " v" . rand(1, 10) . "." . rand(0, 9) . "." . rand(0, 99) . " [$provider]",
                'Magnet' => "magnet:?xt=urn:btih:DEMO$randomString&dn=" . urlencode($query),
                'Size' => rand(1, 20) . "." . rand(0, 99) . " GB",
                'Seeders' => rand(50, 2000),
                'Leechers' => rand(10, 500),
                'Category' => $category,
                'Url' => "https://example.com/torrent/" . strtolower(str_replace(' ', '-', $query)) . "-$i",
                'DateUploaded' => rand(1, 30) . ' days ago',
                'License' => $licenseInfo['type'],
                'LicenseUrl' => $licenseInfo['url']
            ];
            $demoTorrents[] = $item;
        }
        return $demoTorrents;
    }
}
