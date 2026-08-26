# Portfolio content direction

이 문서는 이후 작은 문구·asset·구조 변경에서도 유지할 기준을 기록한다. Portfolio는 repository README를 복사하는 페이지가 아니라, 처음 보는 사람이 문제·기여·판단·검증 범위를 빠르게 이해하고 필요하면 원문으로 이동하게 하는 입구다.

## 계속 유지할 원칙

1. **실제 visual evidence를 앞에 둔다.** Home 카드와 Case Study 상단에는 source repository에 존재하는 실행 화면, demo frame, architecture, ERD, 평가 자료만 사용한다. 없는 화면을 mockup으로 만들지 않는다.
2. **긴 페이지에서도 이동이 쉬워야 한다.** global navigation, Case Study section navigation, 이전·다음 프로젝트 이동을 제공한다. 모바일에서는 본문 폭을 넓히지 않고 navigation 내부만 수평 scroll을 허용한다.
3. **media 크기는 증거의 성격에 맞춘다.** 세로형 앱 영상은 본문을 압도하지 않는 폭으로 제한하고, ERD처럼 읽어야 하는 자료는 넓게 보여준다. 영상은 autoplay하지 않는다.
4. **숫자보다 test context를 함께 보여준다.** 결과에는 어떤 set과 환경을 사용했는지, 무엇을 확인했는지, 무엇까지는 증명하지 못하는지를 함께 쓴다. 개발 과정에서 반복 사용한 set은 독립 test처럼 표현하지 않는다.
5. **source repository를 source of truth로 둔다.** ERD와 평가 자료는 원본 repository의 최신 문서와 일치시킨다. Portfolio를 위해 별도 사실이나 성과를 만들지 않는다.
6. **한계를 현재 상태대로 남긴다.** mock, weak label, 제한된 coverage, 미완료 browser test, text-only fine-tuning 같은 조건을 감추지 않는다. 다음 검증은 완료한 일과 구분해 `What I would test next`로 표시한다.

## Project-specific boundaries

- Security Hub: 팀 전체 Sandbox·Backend·데이터 구축을 개인 기여로 확대하지 않는다. 정확도, 부하, live Sandbox, hardening 결과는 각각의 평가 조건 안에서 설명한다.
- ReviewFit → BeautyLens: OliveYoung 직접 수집과 제공받은 Musinsa·Coupang 데이터 통합을 구분한다. 모델 비교 결과와 BiLSTM 기반 recommendation artifact, BeautyLens 데이터 적재·서비스 검증을 서로 다른 근거로 다룬다.
- Gemma4 T17 RAG: QLoRA는 text-only다. source 단위 분리와 검증을 거친 데이터셋이라고 표현하며, 반복 사용한 development/evaluation set의 retrieval 개선을 독립 final test 성능으로 표현하지 않는다.
