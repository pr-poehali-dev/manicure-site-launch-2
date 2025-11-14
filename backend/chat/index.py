"""
Business: AI-ассистент для общения с клиентами студии маникюра
Args: event - dict with httpMethod, body (messages array)
      context - object with request_id, function_name, memory_limit_in_mb
Returns: HTTP response dict with AI message
"""

import json
import os
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    messages: List[Dict[str, str]] = body_data.get('messages', [])
    
    openai_api_key = os.environ.get('OPENAI_API_KEY')
    if not openai_api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'OpenAI API key not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        from openai import OpenAI
        
        client = OpenAI(api_key=openai_api_key)
        
        system_prompt = """Ты — дружелюбный AI-ассистент студии маникюра. Твоя задача:

1. Отвечать на вопросы о студии и услугах
2. Помогать клиентам выбрать подходящую услугу
3. Консультировать по ценам и времени процедур
4. Направлять на запись к мастеру

ИНФОРМАЦИЯ О СТУДИИ:
- Адрес: г. Москва, ул. Примерная, д. 123
- Телефон: +7 (999) 123-45-67
- Режим работы: Ежедневно с 10:00 до 21:00
- Email: info@manicure-studio.ru

УСЛУГИ И ЦЕНЫ:
1. Классический маникюр — 1500 ₽ (60 мин)
2. Аппаратный маникюр — 1800 ₽ (60 мин)
3. Маникюр + покрытие гель-лак — 2500 ₽ (90 мин)
4. Дизайн ногтей — от 500 ₽ (30 мин)
5. Укрепление ногтей — 2000 ₽ (60 мин)
6. Снятие покрытия — 500 ₽ (30 мин)

МАСТЕРА:
1. Анна Иванова — Мастер по маникюру
2. Мария Петрова — Топ-мастер

ВРЕМЯ ЗАПИСИ:
10:00, 11:30, 13:00, 14:30, 16:00, 17:30, 19:00

Общайся дружелюбно, используй эмодзи где уместно. Если клиент хочет записаться, скажи что он может нажать кнопку "Записаться" на сайте или позвонить."""

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                *messages
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        ai_message = completion.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': ai_message,
                'request_id': context.request_id
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'Error processing request: {str(e)}'
            }),
            'isBase64Encoded': False
        }
