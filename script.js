// HTML 요소들을 가져옵니다.
const connectBtn = document.getElementById('connect-btn');
const statusText = document.getElementById('status-text');
const connectionIcon = document.getElementById('connection-icon');
const body = document.body;

// 블루투스 기기 객체를 저장할 변수
let bluetoothDevice;

// 버튼 클릭 이벤트 리스너
connectBtn.addEventListener('click', async () => {
    try {
        // 1. 디바이스 검색 요청 (브라우저 팝업)
        // filters: 특정 서비스 UUID를 가진 기기만 찾거나,
        // acceptAllDevices: true로 모든 기기를 찾을 수 있습니다.
        // HM-10 모듈은 보통 '0000ffe0-0000-1000-8000-00805f9b34fb' 서비스를 사용합니다.
        
        console.log('디바이스 검색 중...');
        
        const device = await navigator.bluetooth.requestDevice({
            // 모든 블루투스 기기를 보여줍니다 (테스트용으로 적합)
            acceptAllDevices: true, 
            // 나중에 데이터 통신을 위해 접근할 서비스 UUID를 명시해야 합니다.
            // (HM-10 기본 서비스 UUID 예시, 사용하는 모듈에 따라 다를 수 있음)
            optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] 
        });

        bluetoothDevice = device; // 연결된 기기 저장

        // 2. GATT 서버에 연결
        console.log('GATT 서버 연결 시도...');
        const server = await device.gatt.connect();
        
        console.log('연결 성공!', server);

        // 3. UI 업데이트 (연결 성공 시)
        updateUIConnected();

        // 4. 연결 해제 이벤트 감지 (연결이 끊기면 UI를 되돌림)
        device.addEventListener('gattserverdisconnected', onDisconnected);

    } catch (error) {
        console.error('연결 실패:', error);
        alert('연결에 실패했습니다. (' + error + ')');
    }
});

// 연결 성공 시 UI 변경 함수
function updateUIConnected() {
    statusText.innerText = "스마트 방석과 연결되었습니다!";
    connectBtn.style.display = 'none'; // 연결 버튼 숨김
    connectionIcon.classList.remove('hidden'); // 연결 아이콘 표시
    body.classList.add('connected-bg'); // 배경색 변경
}

// 연결 해제 시 처리 함수
function onDisconnected(event) {
    console.log('장치와 연결이 끊어졌습니다.');
    statusText.innerText = "연결이 끊어졌습니다. 다시 연결해주세요.";
    connectBtn.style.display = 'inline-block'; // 버튼 다시 표시
    connectionIcon.classList.add('hidden');
    body.classList.remove('connected-bg');
}