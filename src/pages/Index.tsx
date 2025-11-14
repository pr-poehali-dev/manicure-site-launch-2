import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useTelegram } from '@/hooks/useTelegram';
import { ChatWidget } from '@/components/ChatWidget';

const Index = () => {
  const { toast } = useToast();
  const { tg, user, isTelegramWebApp } = useTelegram();
  const [selectedMaster, setSelectedMaster] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const services = [
    { id: '1', name: 'Классический маникюр', price: '1500 ₽', duration: '60 мин' },
    { id: '2', name: 'Аппаратный маникюр', price: '1800 ₽', duration: '60 мин' },
    { id: '3', name: 'Маникюр + покрытие гель-лак', price: '2500 ₽', duration: '90 мин' },
    { id: '4', name: 'Дизайн ногтей', price: 'от 500 ₽', duration: '30 мин' },
    { id: '5', name: 'Укрепление ногтей', price: '2000 ₽', duration: '60 мин' },
    { id: '6', name: 'Снятие покрытия', price: '500 ₽', duration: '30 мин' },
  ];

  const masters = [
    { id: '1', name: 'Анна Иванова', specialty: 'Мастер по маникюру' },
    { id: '2', name: 'Мария Петрова', specialty: 'Топ-мастер' },
  ];

  const timeSlots = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00'];

  const reviews = [
    { name: 'Елена', rating: 5, text: 'Прекрасный мастер! Аккуратная работа, маникюр держится долго. Буду приходить ещё!' },
    { name: 'Ольга', rating: 5, text: 'Очень довольна результатом. Приятная атмосфера, всё стерильно. Рекомендую!' },
    { name: 'Анастасия', rating: 5, text: 'Лучший мастер в городе! Всегда выхожу с идеальными ноготками.' },
  ];

  useEffect(() => {
    if (tg && isTelegramWebApp) {
      tg.MainButton.setText('Записаться');
      tg.MainButton.color = '#FF8BA0';
      tg.MainButton.textColor = '#FFFFFF';
      
      if (selectedMaster && selectedService && selectedDate && selectedTime) {
        tg.MainButton.show();
        tg.MainButton.enable();
      } else {
        tg.MainButton.hide();
      }
    }
  }, [tg, isTelegramWebApp, selectedMaster, selectedService, selectedDate, selectedTime]);

  useEffect(() => {
    if (tg && isTelegramWebApp) {
      const handleMainButtonClick = () => {
        handleBooking();
      };
      
      tg.MainButton.onClick(handleMainButtonClick);
      
      return () => {
        tg.MainButton.offClick(handleMainButtonClick);
      };
    }
  }, [tg, isTelegramWebApp, selectedMaster, selectedService, selectedDate, selectedTime]);

  const handleBooking = () => {
    if (!selectedMaster || !selectedService || !selectedDate || !selectedTime) {
      toast({
        title: "Заполните все поля",
        description: "Пожалуйста, выберите мастера, услугу, дату и время записи.",
        variant: "destructive",
      });
      return;
    }

    const master = masters.find(m => m.id === selectedMaster);
    const service = services.find(s => s.id === selectedService);
    
    const bookingData = {
      master: master?.name || '',
      service: service?.name || '',
      price: service?.price || '',
      date: selectedDate,
      time: selectedTime,
      user: user?.first_name || 'Гость',
      userId: user?.id || 0,
    };

    if (isTelegramWebApp && tg) {
      tg.sendData(JSON.stringify(bookingData));
      tg.close();
    } else {
      toast({
        title: "Запись подтверждена!",
        description: `Вы записаны на ${selectedDate} в ${selectedTime}. Мы ждём вас!`,
      });
    }

    setSelectedMaster('');
    setSelectedService('');
    setSelectedDate('');
    setSelectedTime('');
    setIsBookingDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <header className={`fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-border ${isTelegramWebApp ? 'hidden' : ''}`}>
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Студия маникюра</h1>
            <div className="hidden md:flex gap-6">
              <a href="#services" className="hover:text-primary transition-colors">Услуги</a>
              <a href="#gallery" className="hover:text-primary transition-colors">Галерея</a>
              <a href="#reviews" className="hover:text-primary transition-colors">Отзывы</a>
              <a href="#contacts" className="hover:text-primary transition-colors">Контакты</a>
            </div>
            <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Icon name="Calendar" className="mr-2" size={18} />
                  Записаться
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Онлайн-запись</DialogTitle>
                  <DialogDescription>
                    Выберите мастера, услугу и удобное время
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="master">Выберите мастера</Label>
                    <Select value={selectedMaster} onValueChange={setSelectedMaster}>
                      <SelectTrigger id="master">
                        <SelectValue placeholder="Мастер" />
                      </SelectTrigger>
                      <SelectContent>
                        {masters.map((master) => (
                          <SelectItem key={master.id} value={master.id}>
                            {master.name} — {master.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="service">Выберите услугу</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Услуга" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} — {service.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="date">Выберите дату</Label>
                    <input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="time">Выберите время</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger id="time">
                        <SelectValue placeholder="Время" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleBooking} className="w-full bg-primary hover:bg-primary/90">
                  Подтвердить запись
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </nav>
      </header>

      <section className={`${isTelegramWebApp ? 'pt-8' : 'pt-32'} pb-20 px-4`}>
        <div className="container mx-auto text-center">
          <h2 className={`${isTelegramWebApp ? 'text-3xl md:text-4xl' : 'text-5xl md:text-7xl'} font-bold mb-6 animate-fade-in text-foreground`}>
            {isTelegramWebApp ? `Привет, ${user?.first_name || 'Гость'}!` : 'Красота ваших ногтей —'}
            {!isTelegramWebApp && <><br />наша страсть</>}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            {isTelegramWebApp ? 'Выберите удобное время для записи на маникюр' : 'Профессиональный маникюр в уютной атмосфере. Используем только качественные материалы и современные техники.'}
          </p>
          <div className={`flex gap-4 justify-center animate-scale-in ${isTelegramWebApp ? 'hidden' : ''}`}>
            <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Записаться на процедуру
                  <Icon name="ArrowRight" className="ml-2" size={18} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Онлайн-запись</DialogTitle>
                  <DialogDescription>
                    Выберите мастера, услугу и удобное время
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="master2">Выберите мастера</Label>
                    <Select value={selectedMaster} onValueChange={setSelectedMaster}>
                      <SelectTrigger id="master2">
                        <SelectValue placeholder="Мастер" />
                      </SelectTrigger>
                      <SelectContent>
                        {masters.map((master) => (
                          <SelectItem key={master.id} value={master.id}>
                            {master.name} — {master.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="service2">Выберите услугу</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger id="service2">
                        <SelectValue placeholder="Услуга" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} — {service.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="date2">Выберите дату</Label>
                    <input
                      id="date2"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="time2">Выберите время</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger id="time2">
                        <SelectValue placeholder="Время" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleBooking} className="w-full bg-primary hover:bg-primary/90">
                  Подтвердить запись
                </Button>
              </DialogContent>
            </Dialog>
            <Button size="lg" variant="outline" asChild>
              <a href="#gallery">Посмотреть работы</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="services" className={`py-20 px-4 ${isTelegramWebApp ? 'bg-transparent' : 'bg-white'}`}>
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Наши услуги</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <CardTitle className="text-2xl">{service.name}</CardTitle>
                  <CardDescription>{service.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary mb-4">{service.price}</p>
                  {isTelegramWebApp ? (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        setSelectedService(service.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Выбрать
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" variant="outline">
                          Записаться
                        </Button>
                      </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Онлайн-запись</DialogTitle>
                        <DialogDescription>
                          Выберите мастера, услугу и удобное время
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`master-${service.id}`}>Выберите мастера</Label>
                          <Select value={selectedMaster} onValueChange={setSelectedMaster}>
                            <SelectTrigger id={`master-${service.id}`}>
                              <SelectValue placeholder="Мастер" />
                            </SelectTrigger>
                            <SelectContent>
                              {masters.map((master) => (
                                <SelectItem key={master.id} value={master.id}>
                                  {master.name} — {master.specialty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`service-${service.id}`}>Выберите услугу</Label>
                          <Select value={service.id} onValueChange={setSelectedService}>
                            <SelectTrigger id={`service-${service.id}`}>
                              <SelectValue placeholder="Услуга" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                  {s.name} — {s.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`date-${service.id}`}>Выберите дату</Label>
                          <input
                            id={`date-${service.id}`}
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`time-${service.id}`}>Выберите время</Label>
                          <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger id={`time-${service.id}`}>
                              <SelectValue placeholder="Время" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button onClick={handleBooking} className="w-full bg-primary hover:bg-primary/90">
                        Подтвердить запись
                      </Button>
                    </DialogContent>
                  </Dialog>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {isTelegramWebApp && (
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-lg">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Форма записи</CardTitle>
                <CardDescription>Заполните все поля для записи</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tg-master">Выберите мастера</Label>
                  <Select value={selectedMaster} onValueChange={setSelectedMaster}>
                    <SelectTrigger id="tg-master">
                      <SelectValue placeholder="Мастер" />
                    </SelectTrigger>
                    <SelectContent>
                      {masters.map((master) => (
                        <SelectItem key={master.id} value={master.id}>
                          {master.name} — {master.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tg-service">Выберите услугу</Label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger id="tg-service">
                      <SelectValue placeholder="Услуга" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} — {service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tg-date">Выберите дату</Label>
                  <input
                    id="tg-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tg-time">Выберите время</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger id="tg-time">
                      <SelectValue placeholder="Время" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <section id="gallery" className={`py-20 px-4 ${isTelegramWebApp ? 'hidden' : 'bg-secondary/20'}`}>
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Галерея работ</h2>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="all">Все работы</TabsTrigger>
              <TabsTrigger value="classic">Классика</TabsTrigger>
              <TabsTrigger value="design">Дизайн</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-lg group cursor-pointer animate-fade-in">
                  <img 
                    src="https://cdn.poehali.dev/projects/d180635c-cfbb-4caf-bb9f-7354baeea36e/files/8c96f067-f28a-4326-8b92-db9ecf204ee9.jpg" 
                    alt="Маникюр 1" 
                    className="w-full h-80 object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-lg font-semibold">Нежный маникюр</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg group cursor-pointer animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <img 
                    src="https://cdn.poehali.dev/projects/d180635c-cfbb-4caf-bb9f-7354baeea36e/files/eacdf2b5-4f89-4186-840b-a245671f4a39.jpg" 
                    alt="Маникюр 2" 
                    className="w-full h-80 object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-lg font-semibold">Дизайн с цветами</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg group cursor-pointer animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <img 
                    src="https://cdn.poehali.dev/projects/d180635c-cfbb-4caf-bb9f-7354baeea36e/files/c6f92812-f117-4def-b28f-c3287d501c82.jpg" 
                    alt="Салон" 
                    className="w-full h-80 object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-lg font-semibold">Наш салон</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="classic">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-lg group cursor-pointer">
                  <img 
                    src="https://cdn.poehali.dev/projects/d180635c-cfbb-4caf-bb9f-7354baeea36e/files/8c96f067-f28a-4326-8b92-db9ecf204ee9.jpg" 
                    alt="Классический маникюр" 
                    className="w-full h-80 object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-lg font-semibold">Классический маникюр</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="design">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-lg group cursor-pointer">
                  <img 
                    src="https://cdn.poehali.dev/projects/d180635c-cfbb-4caf-bb9f-7354baeea36e/files/eacdf2b5-4f89-4186-840b-a245671f4a39.jpg" 
                    alt="Дизайн ногтей" 
                    className="w-full h-80 object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-lg font-semibold">Авторский дизайн</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section id="reviews" className={`py-20 px-4 ${isTelegramWebApp ? 'hidden' : 'bg-white'}`}>
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Отзывы клиентов</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">{review.name[0]}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Icon key={i} name="Star" size={16} className="fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{review.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className={`py-20 px-4 ${isTelegramWebApp ? 'hidden' : 'bg-secondary/20'}`}>
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Контакты</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MapPin" size={24} className="text-primary" />
                  Адрес
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">г. Москва, ул. Примерная, д. 123</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Phone" size={24} className="text-primary" />
                  Телефон
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">+7 (999) 123-45-67</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Clock" size={24} className="text-primary" />
                  Режим работы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Ежедневно с 10:00 до 21:00</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Mail" size={24} className="text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">info@manicure-studio.ru</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className={`bg-foreground text-white py-8 px-4 ${isTelegramWebApp ? 'hidden' : ''}`}>
        <div className="container mx-auto text-center">
          <p className="text-lg mb-4">Студия маникюра — ваша красота в надёжных руках</p>
          <div className="flex gap-4 justify-center">
            <a href="#" className="hover:text-primary transition-colors">
              <Icon name="Instagram" size={24} />
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <Icon name="Facebook" size={24} />
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <Icon name="Phone" size={24} />
            </a>
          </div>
          <p className="mt-4 text-sm text-white/60">© 2024 Все права защищены</p>
        </div>
      </footer>

      {!isTelegramWebApp && <ChatWidget />}
    </div>
  );
};

export default Index;