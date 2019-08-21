import React from 'react';

const FinalConfirmation = () => {
    return (
        <div data-am-page="">
            <section className="page-section">
                <h1 className="h6">Tack för din order!</h1>
                <div data-am-content="">
                    <p>En orderbekräftelse kommer att skickas till din e-postadress <span className="font-medium">jane.doe@email.com</span>.</p>
                    <p>Orderbekräftelsen skickas normalt inom <span className="font-medium">10 minuter</span>, men kan i undantagsfall dröja upp till <span className="font-medium">48 timmar</span>.</p>
                </div>
            </section>

            <section className="page-section page-section-accent">
                <div className="page-section-accent-content">
                    <h2 className="h6">Din order</h2>
                </div>
                Product Card
            </section>

            <section className="page-section">
                <h2 className="h6">Kunduppgifter</h2>

                <div data-am-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">För- och efternamn</div>
                    </div>
                    <div className="column">J*** D**</div>
                </div>

                <div data-am-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">Gatuadress</div>
                    </div>
                    <div className="column">B******* 5</div>
                </div>

                <div data-am-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">Postnummer</div>
                    </div>
                    <div className="column">*** 55</div>
                </div>

                <div data-am-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">Postort</div>
                    </div>
                    <div className="column">G*******</div>
                </div>

                <div data-am-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">E-post</div>
                    </div>
                    <div className="column">jane.doe@gmail.com</div>
                </div>

                <div data-am-columnrow="" className="repeat-m-half">
                    <div className="column">
                        <div className="font-medium font-size-small">Telefonnummer</div>
                    </div>
                    <div className="column">076 399 58 21</div>
                </div>
            </section>

            <section className="page-section">
                <h2 className="h6">Leveranssätt</h2>
                <div data-am-content="">
                    <p>Din beställning är färdig och kan hämtas hos Börjessons bil Ängelholm, <span className="font-medium">Idag 30 maj</span>.</p>
                </div>
            </section>
        </div>
    );
};

export default FinalConfirmation;